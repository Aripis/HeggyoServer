import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateMessagePayload {
    constructor(private readonly uuid: string) {
        this.messageId = uuid;
    }

    @Field()
    messageId: string;
}
