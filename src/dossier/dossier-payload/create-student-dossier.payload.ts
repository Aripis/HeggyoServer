import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateStudentDossierPayload {
    constructor(private readonly uuid: string) {
        this.studentId = uuid;
    }

    @Field()
    studentId: string;
}
