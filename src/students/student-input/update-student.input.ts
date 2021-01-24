import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';

@InputType()
export class UpdateStudentInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    classUUID?: string;

    @Field({ nullable: true })
    prevEducation?: string;

    @Field({ nullable: true })
    recordMessage?: string;

    // TODO: implement file upload
    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];
}
