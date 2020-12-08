import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { LoginInput } from '../auth/login.input';
import { AuthService } from '../auth/auth.service';
import { Token } from '../auth/token.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/currentuser.decorator';
import { ConfigService } from '@nestjs/config';

import { User } from './user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './user-input/create-user.input';
import { UpdateUserInput } from './user-input/update-user.input';
import { UpdateUserPayload } from './user-payload/update-user.payload';
import { RemoveUserPayload } from './user-payload/remove-user.payload';
import { CreateUserPayload } from './user-payload/create-user.payload';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    // TODO: set guards

    @Query(() => User)
    async user(@Args('id') uuid: string): Promise<User> {
        const user = await this.usersService.findOne(uuid);
        user.password = '';
        return user;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        const users = await this.usersService.findAll();
        return users.map(user => {
            user.password = '';
            return user;
        });
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async profile(@CurrentUser() currUser: User) {
        const user = await this.usersService.findOne(currUser.id);
        user.password = '';
        return user;
    }

    @Query(() => Boolean)
    checkRefreshToken(@Context() ctx) {
        return this.authService.verifyToken(ctx.req.cookies.refreshToken);
    }

    @Query(() => User)
    async login(@Args('loginInput') loginInput: LoginInput, @Context() ctx) {
        const tokens = await this.authService.login(loginInput);
        ctx.res.cookie('refreshToken', tokens.refreshToken, {
            maxAge:
                this.configService.get<number>(
                    'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
                ) * 1000, //should be 60 days (now is 120s)
            httpOnly: true,
        });
        ctx.res.cookie('accessToken', tokens.accessToken, {
            maxAge:
                this.configService.get<number>(
                    'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
                ) * 1000, //should be 30 mins (now is 60s)
            httpOnly: true,
        });
        return this.usersService.findOne(loginInput.email);
    }

    @Query(() => Boolean)
    async logout(@Context() ctx) {
        ctx.res.clearCookie('accessToken');
        ctx.res.clearCookie('refreshToken');
        return true;
    }

    @Query(() => Token)
    async token(@Context() ctx) {
        const accessToken = await this.authService.regenerateToken(
            ctx.req.cookies.refreshToken,
        );
        ctx.res.cookie('accessToken', accessToken, {
            maxAge:
                this.configService.get<number>(
                    'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
                ) * 1000, //should be 30 mins (now is 60s)
            httpOnly: true,
        });
        return {
            accessToken,
        };
    }

    @Mutation(() => CreateUserPayload)
    register(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<CreateUserPayload> {
        return this.usersService.create(createUserInput);
    }

    @Mutation(() => RemoveUserPayload)
    removeUser(@Args('id') uuid: string): Promise<RemoveUserPayload> {
        return this.usersService.remove(uuid);
    }

    @Mutation(() => UpdateUserPayload)
    @UseGuards(GqlAuthGuard)
    updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ): Promise<UpdateUserPayload> {
        return this.usersService.update(updateUserInput);
    }
}
