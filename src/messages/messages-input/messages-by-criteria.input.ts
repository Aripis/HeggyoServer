import { Field, InputType } from '@nestjs/graphql';
import { AssignmentType, MessageStatus, MessageType } from '../message.model';

@InputType()
export class MessagesByCriteriaInput {
    @Field(() => MessageType, { nullable: true })
    messageType?: MessageType;

    @Field(() => MessageStatus, { nullable: true })
    messageStatus?: MessageStatus;

    @Field(() => AssignmentType, { nullable: true })
    assingmentType?: AssignmentType;
}
