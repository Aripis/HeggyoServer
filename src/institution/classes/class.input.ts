/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ClassInput {
    @Field({ nullable: false })
    classLetter: string;

    @Field({ nullable: false })
    forYear: number;

    @Field({ nullable: false })
    totalStudentCount: number;

    @Field({ nullable: false })
    classNumber: number;

    @Field({ nullable: false })
    classTeacherId: number;
}
