import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    parents(): Promise<Parent[]> {
        return this.parentsService.findAll();
    }

    @Mutation(() => UpdateParentPayload)
    updateParent(
        @Args('parentData') parentData: UpdateParentInput,
    ): Promise<UpdateParentPayload> {
        return this.parentsService.update(parentData);
    }
}
