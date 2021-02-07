import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';

@InputType()
export class CreateStudentDossierInput {
    @Field()
    studentId: string;

    @Field()
    subjectUUID: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];

    @Field()
    dossierMessage: string;
}
