import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveUserPayload {
    constructor(private readonly removed: boolean) {
        this.removed = removed;
    }

    @Field()
    userIsRemoved: boolean;
}
