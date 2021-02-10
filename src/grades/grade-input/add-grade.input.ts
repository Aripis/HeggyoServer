import { Field, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { GradeTypes } from '../grade.model';
// import { UploadScalar } from 'src/common/scalars/upload.scalar';

@InputType()
export class AddGradeInput {
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

    @Field(() => GradeTypes)
    type: GradeTypes;
}
