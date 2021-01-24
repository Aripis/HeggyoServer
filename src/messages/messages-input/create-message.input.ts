import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { AssignmentType, MessageType } from '../message.model';

@InputType()
export class CreateMessageInput {
    @Field(() => [String], { nullable: true })
    toUserUUIDs?: string[];

    @Field(() => [String], { nullable: true })
    toClassUUIDs?: string[];

    @Field({ nullable: true })
    data?: string;

    // TODO: implement file upload
    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];

    @Field(() => AssignmentType, { nullable: true })
    assignmentType?: AssignmentType;

    @Field(() => MessageType)
    type: MessageType;

    @Field({ nullable: true })
    subjectUUID?: string;

    @Field({ nullable: true })
    assignmentDueDate?: Date;
}
