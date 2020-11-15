/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class StudentInput {
    @Field({ nullable: false })
    education: string;

    @Field({ nullable: false })
    workExperience: number;
}
