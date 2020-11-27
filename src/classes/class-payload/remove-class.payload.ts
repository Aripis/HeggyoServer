import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveClassPayload {
    constructor(private readonly uuid: string) {
        this.classId = uuid;
    }

    @Field()
    classId: string;
}
