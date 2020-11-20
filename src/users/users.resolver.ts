/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { UserInput } from './user.input';
import { LoginInput } from '../auth/login.input';
import { User } from './user.model';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Token } from '../auth/token.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/currentuser.decorator';
import { ConfigService } from '@nestjs/config';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Query(returns => User)
    async user(@Args('id') id: string): Promise<User> {
        const user = await this.usersService.findOne(id);
        user.password = '';
        return user;
    }

    @Query(returns => [User])
    async users(): Promise<User[]> {
        const users = await this.usersService.findAll();
        return users.map(user => {
            user.password = '';
            return user;
        });
    }

    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    profile(@CurrentUser() user: User) {
        return this.usersService.findOne(user.id);
    }

    @Query(returns => User)
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

    @Query(returns => Token)
    async token(@Context() ctx) {
        const accessToken = await this.authService.regenerateToken(
            ctx.req.cookies.refreshToken,
        );
        ctx.res.set('Authorization', 'Bearer ' + accessToken);
        return {
            accessToken,
        };
    }

    @Mutation(returns => User)
    async register(@Args('userData') userData: UserInput): Promise<User> {
        return this.usersService.create(userData);
    }

    @Mutation(returns => User)
    async addUser(@Args('userData') userData: UserInput): Promise<User> {
        return this.usersService.create(userData);
    }

    @Mutation(returns => Boolean)
    async removeUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.remove(id);
    }
}
