import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateParentPayload {
    constructor(private readonly uuid: string) {
        this.parentId = uuid;
    }

    @Field()
    parentId: string;
}
