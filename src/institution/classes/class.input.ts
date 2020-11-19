import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ClassInput {
    @Field()
    classLetter: string;

    @Field(() => Int)
    forYear: number;

    @Field(() => Int)
    totalStudentCount: number;

    @Field(() => Int)
    classNumber: number;

    @Field(() => Int)
    classTeacherId: number;
}
