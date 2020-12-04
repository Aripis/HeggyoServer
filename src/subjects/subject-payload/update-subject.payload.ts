import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateSubjectPayload {
    constructor(private readonly uuid: string) {
        this.subjectId = uuid;
    }

    @Field()
    subjectId: string;
}
