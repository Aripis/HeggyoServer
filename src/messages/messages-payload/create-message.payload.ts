import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateMessagePayload {
    constructor(private readonly uuid: string) {
        this.messageId = uuid;
    }

    @Field()
    messageId: string;
}
