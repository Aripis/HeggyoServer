import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { AssignmentType, MessageType } from '../message.model';
import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddMessageInput {
    @Field(() => [String], { nullable: true })
    toUserIds?: string[];

    @Field(() => [String], { nullable: true })
    toClassIds?: string[];

    @Field({ nullable: true })
    data?: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];

    @Field(() => AssignmentType, { nullable: true })
    assignmentType?: AssignmentType;

    @Field(() => MessageType)
    messageType: MessageType;

    @Field({ nullable: true })
    @IsUUID('all')
    subjectId?: string;

    @Field({ nullable: true })
    assignmentDueDate?: Date;
}
