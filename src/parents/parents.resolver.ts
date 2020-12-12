import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { UpdateParentInput } from './parent-input/update-parent.input';
import { UpdateParentPayload } from './parent-payload/update-parent.payload';

import { Parent } from './parent.model';
import { ParentsService } from './parents.service';

@Resolver(() => Parent)
export class ParentsResolver {
    constructor(private readonly parentsService: ParentsService) {}

    @Query(() => Parent)
    parent(@Args('id') uuid: string): Promise<Parent> {
        return this.parentsService.findOne(uuid);
    }

    @Query(() => [Parent])
    @UseGuards(GqlAuthGuard)
    parents(@CurrentUser() currUser: User): Promise<Parent[]> {
        return this.parentsService.findAll(currUser);
    }

    @Mutation(() => UpdateParentPayload)
    updateParent(
        @Args('parentData') parentData: UpdateParentInput,
    ): Promise<UpdateParentPayload> {
        return this.parentsService.update(parentData);
    }
}
