import { Field, InputType } from '@nestjs/graphql';
import { MessageStatus } from '../message.model';
// import { UploadScalar } from 'src/common/scalars/upload.scalar';

@InputType()
export class UpdateMessageInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    data?: string;

    @Field(() => MessageStatus)
    status: MessageStatus;

    // TODO: implement file upload
    // @Field(() => [UploadScalar], { nullable: true })
    // files?: UploadScalar[];

    @Field({ nullable: true })
    assignmentDueDate?: Date;
}
