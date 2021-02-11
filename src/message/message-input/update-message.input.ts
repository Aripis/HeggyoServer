import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { Field, InputType } from '@nestjs/graphql';
import { MessageStatus } from '../message.model';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateMessageInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field({ nullable: true })
    data?: string;

    @Field(() => MessageStatus)
    status: MessageStatus;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];

    @Field({ nullable: true })
    assignmentDueDate?: Date;
}
