/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInput } from './user.input';
import { LoginInput } from '../auth/login.input';
import { User } from './user.model';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Token } from '../auth/token.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/currentuser.decorator';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,
    ) {}

    @Query(returns => User)
    async userById(@Args('id', { type: () => Int }) id: number): Promise<User> {
        const user = await this.usersService.findOne(id);
        user.password = '';
        return user;
    }

    @Query(returns => User)
    async userByEmail(@Args('email') email: string): Promise<User> {
        const user = await this.usersService.findOne(email);
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

    @Query(returns => Token)
    async login(@Args('newLoginData') newLoginData: LoginInput) {
        return this.authService.login(newLoginData);
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
