/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInput } from './user.input';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(returns => User)
    async user(@Args('id') id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Query(returns => [User])
    users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Mutation(returns => User)
    async addUser(@Args('newUserData') newUserData: UserInput): Promise<User> {
        return this.usersService.create(newUserData);
    }

    @Mutation(returns => Boolean)
    async removeRecipe(@Args('id') id: number) {
        return this.usersService.remove(id);
    }
}
