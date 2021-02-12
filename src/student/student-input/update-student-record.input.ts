import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateStudentRecordInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field({ nullable: true })
    recordMessage?: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];
}
