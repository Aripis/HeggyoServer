import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ClassInput {
    @Field(() => Int)
    forYear: number;

    @Field(() => Int)
    totalStudentCount: number;

    @Field()
    classNumber: { number: number; letter: string };

    @Field()
    classTeacherUUId: string;
}
