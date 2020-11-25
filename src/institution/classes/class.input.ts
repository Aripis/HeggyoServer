import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ClassInput {
    @Field(() => Int)
    forYear: number;

    @Field(() => Int)
    totalStudentCount: number;

    @Field(() => Int)
    classNumber: number;

    @Field()
    classLetter: string;

    @Field({ nullable: true })
    classTeacher?: string;

    @Field()
    institution: string;
}
