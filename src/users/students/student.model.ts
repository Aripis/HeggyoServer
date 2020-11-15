/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Student {
    @Field({ nullable: false })
    education: string;

    @Field({ nullable: false })
    workExperience: number;
}
