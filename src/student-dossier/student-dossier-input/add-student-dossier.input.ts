import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddStudentDossierInput {
    @Field()
    @IsUUID('all')
    studentId: string;

    @Field()
    @IsUUID('all')
    subjectId: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];

    @Field()
    message: string;
}
