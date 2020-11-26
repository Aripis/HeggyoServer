import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParentInput } from './parent.input';

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

    // TODO: create for each mutation Payload
    @Mutation(() => Boolean)
    async removeParent(@Args('id') uuid: string) {
        return this.parentsService.remove(uuid);
    }

    // TODO: create for each mutation Payload
    @Mutation(() => Parent)
    async updateParent(
        @Args('parentData') parentData: ParentInput,
    ): Promise<Parent> {
        // TODO: fix this
        const parent = new Parent();

        Object.assign(parent, parentData);
        return await this.parentsService.update(parent);
    }
}
