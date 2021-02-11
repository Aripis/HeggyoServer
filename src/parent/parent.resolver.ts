import { UpdateParentInput } from './parent-input/update-parent.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParentPayload } from './parent-payload/parent.payload';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { ParentService } from './parent.service';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';
import { Parent } from './parent.model';

@Resolver(() => Parent)
export class ParentResolver {
    constructor(private readonly parentService: ParentService) {}

    @Query(() => Parent)
    @UseGuards(GqlAuthGuard)
    getParent(@Args('id') id: string): Promise<Parent> {
        return this.parentService.findOne(id);
    }

    @Query(() => [Parent])
    @UseGuards(GqlAuthGuard)
    getAllParents(@CurrentUser() currUser: User): Promise<Parent[]> {
        return this.parentService.findAll(currUser);
    }

    @Mutation(() => ParentPayload)
    @UseGuards(GqlAuthGuard)
    updateParent(
        @Args('input') input: UpdateParentInput,
    ): Promise<ParentPayload> {
        return this.parentService.update(input);
    }
}
