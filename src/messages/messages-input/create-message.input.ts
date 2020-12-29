import { Field, InputType } from '@nestjs/graphql';
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
    // @Field({ nullable: true})
    //files

    @Field(() => AssignmentType, { nullable: true })
    assignmentType?: AssignmentType;

    @Field(() => MessageType)
    type: MessageType;

    @Field({nullable: true})
    subjectUUID?: string;

    @Field({ nullable: true })
    assignmentDueDate?: Date;
}
