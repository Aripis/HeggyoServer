import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateClassInput {
    @Field(() => Int)
    startYear: number;

    @Field(() => Int)
    endYear: number;

    @Field(() => Int)
    totalStudentCount: number;

    @Field(() => Int)
    classNumber: number;

    @Field()
    classLetter: string;

    @Field({ nullable: true })
    classTeacher?: string;
}
