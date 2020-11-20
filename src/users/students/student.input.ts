import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StudentInput {
    @Field({ nullable: true })
    prevEducation?: string;

    @Field()
    studentToken: string;
}
