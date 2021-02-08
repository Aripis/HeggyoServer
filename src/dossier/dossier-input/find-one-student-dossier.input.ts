import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneStudentDossierInput {
    @Field()
    studentId: string;
}
