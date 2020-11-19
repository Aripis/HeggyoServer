import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StudentInput {
    @Field()
    prevEducation: string;
}
