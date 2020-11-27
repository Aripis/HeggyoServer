import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateClassPayload {
    constructor(private readonly uuid: string) {
        this.classId = uuid;
    }

    @Field()
    classId: string;
}
