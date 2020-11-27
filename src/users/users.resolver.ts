import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { LoginInput } from '../auth/login.input';
import { AuthService } from '../auth/auth.service';
import { Token } from '../auth/token.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/currentuser.decorator';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User } from './user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './create-user.input';
import { UpdateUserInput } from './update-user.input';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

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

    @Query(() => Boolean)
    checkRefreshToken(@Context() ctx) {
        return this.authService.verifyToken(ctx.req.cookies.refreshToken);
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

    // TODO: create for each mutation Payload
    @Mutation(() => User)
    async register(@Args('userData') userData: CreateUserInput): Promise<User> {
        return await this.usersService.create(userData);
    }

    // TODO: create for each mutation Payload
    @Mutation(() => Boolean)
    removeUser(@Args('id') uuid: string) {
        return this.usersService.remove(uuid);
    }

    // TODO: create for each mutation Payload
    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    async updateUser(@Args('userData') userData: UpdateUserInput) {
        // TODO: move this part into users.service, where it belongs
        const updatedUser = await this.usersService.findOne(userData.id);
        if (userData) {
            if (userData.password) {
                updatedUser.password = await bcrypt.hash(userData.password, 10);
            }

            if (userData.email) {
                updatedUser.email = userData.email;
            }

            if (userData.firstName) {
                updatedUser.firstName = userData.firstName;
            }

            if (userData.lastName) {
                updatedUser.lastName = userData.lastName;
            }

            if (userData.middleName) {
                updatedUser.middleName = userData.middleName;
            }

            if (userData.userRole) {
                updatedUser.userRole = userData.userRole;
            }
        }

        return await this.usersService.update(updatedUser);
    }
}
