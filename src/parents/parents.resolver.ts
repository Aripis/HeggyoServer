import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateParentInput } from './parent-input/update-parent.input';
import { UpdateParentPayload } from './parent-payload/update-parent.payload';

import { Parent } from './parent.model';
import { ParentsService } from './parents.service';

@Resolver(() => Parent)
export class ParentsResolver {
    constructor(private readonly parentsService: ParentsService) {}

    @Query(() => Parent)
    async parent(@Args('id') uuid: string): Promise<Parent> {
        return await this.parentsService.findOne(uuid);
    }

    @Query(() => [Parent])
    async parents(): Promise<Parent[]> {
        return await this.parentsService.findAll();
    }

    @Mutation(() => UpdateParentPayload)
    async updateParent(
        @Args('parentData') parentData: UpdateParentInput,
    ): Promise<UpdateParentPayload> {
        return await this.parentsService.update(parentData);
    }
}
