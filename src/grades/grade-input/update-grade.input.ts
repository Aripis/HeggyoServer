import { Field, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class UpdateGradeInput {
    @Field()
    gradeUUID: string;

    @Field()
    studentId: string;

    @Field()
    subjectUUID: string;

    @Field()
    message?: string;

    @Field()
    @Min(2)
    @Max(6)
    grade: number;

    @Field()
    gradeWithWords: string;
}
