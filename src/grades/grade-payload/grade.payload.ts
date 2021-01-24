import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GradePayload {
    constructor(private readonly uuid: string) {
        this.gradeId = uuid;
    }

    @Field()
    gradeId: string;
}
