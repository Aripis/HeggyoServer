import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateStudentDossierInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field({ nullable: true })
    @IsUUID('all')
    subjectId?: string;

    @Field({ nullable: true })
    message?: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];
}
