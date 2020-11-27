import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateStudentInput {
    @Field({ nullable: true })
    prevEducation?: string;

    @Field()
    studentToken: string;
}
