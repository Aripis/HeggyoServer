import { GradeType, GradeWord } from '../grade.model';
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, Max, Min } from 'class-validator';

@InputType()
export class AddGradeInput {
    @Field()
    @IsUUID('all')
    studentId: string;

    @Field()
    @IsUUID('all')
    subjectId: string;

    @Field()
    message: string;

    @Field()
    @Min(2)
    @Max(6)
    grade: number;

    @Field(() => GradeWord)
    gradeWithWords: GradeWord;

    @Field(() => GradeType)
    type: GradeType;
}
