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
        return this.usersService.findOne('kalata@aripis.com');
    }

    @Query(returns => Token)
    async login(
        @Args('newLoginData') newLoginData: LoginInput,
        @Context() ctx,
    ) {
        const tokens = await this.authService.login(
            newLoginData,
            ctx.req.cookies.refreshToken,
        );
        if (ctx.req.cookies.refreshToken !== tokens.refreshToken) {
            ctx.res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 144000 * 60 * 1000, //100 days
                httpOnly: true,
            });
        }
        return tokens;
    }

    @Mutation(returns => User)
    async register(@Args('newUserData') newUserData: UserInput): Promise<User> {
        return this.usersService.create(newUserData);
    }

    @Mutation(returns => User)
    async addUser(@Args('newUserData') newUserData: UserInput): Promise<User> {
        return this.usersService.create(newUserData);
    }

    @Mutation(returns => Boolean)
    async removeUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.remove(id);
    }
}
