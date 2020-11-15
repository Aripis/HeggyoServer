/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInput } from './user.input';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

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

    @Mutation(returns => User)
    async addUser(@Args('newUserData') newUserData: UserInput): Promise<User> {
        return this.usersService.create(newUserData);
    }

    @Mutation(returns => Boolean)
    async removeUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.remove(id);
    }
}
