import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateStudentPayload {
    constructor(private readonly uuid: string) {
        this.studentId = uuid;
    }

    @Field()
    studentId: string;
}
