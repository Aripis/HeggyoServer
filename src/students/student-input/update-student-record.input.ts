import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';

@InputType()
export class UpdateStudentRecordInput {
    @Field()
    uuid: string;

    @Field({ nullable: true })
    recordMessage?: string;

    // TODO: implement file upload
    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];
}
