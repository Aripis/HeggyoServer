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
import { RegisterClassInput } from './user-input/register-user.input';
import { UpdateUserInput } from './user-input/update-user.input';
import { UpdateUserPayload } from './user-payload/update-user.payload';
import { RemoveUserPayload } from './user-payload/remove-user.payload';
import { RegisterUserPayload } from './user-payload/register-user.payload';

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
    profile(@CurrentUser() user: User) {
        return this.usersService.findOne(user.id);
    }

    @Query(() => User)
    async login(@Args('loginData') loginData: LoginInput, @Context() ctx) {
        const tokens = await this.authService.login(loginData);
        ctx.res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 86400 * 60 * 1000, //100 days
            httpOnly: true,
        });
        ctx.res.set('Authorization', 'Bearer ' + tokens.accessToken);
        const user = await this.usersService.findOne(loginData.email);
        return user;
    }

    @Query(() => Token)
    async token(@Context() ctx) {
        const accessToken = await this.authService.regenerateToken(
            ctx.req.cookies.refreshToken,
        );
        ctx.res.set('Authorization', 'Bearer ' + accessToken);
        return {
            accessToken,
        };
    }

    @Mutation(() => RegisterUserPayload)
    async register(
        @Args('userData') userData: RegisterClassInput,
    ): Promise<RegisterUserPayload> {
        return await this.usersService.create(userData);
    }

    @Mutation(() => RemoveUserPayload)
    removeUser(@Args('id') uuid: string): Promise<RemoveUserPayload> {
        return this.usersService.remove(uuid);
    }

    @Mutation(() => UpdateUserPayload)
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @Args('userData') userData: UpdateUserInput,
    ): Promise<UpdateUserPayload> {
        return await this.usersService.update(userData);
    }
}
