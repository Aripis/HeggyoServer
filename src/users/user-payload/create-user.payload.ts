import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserPayload {
    constructor(private readonly uuid: string) {
        this.userId = uuid;
    }

    @Field()
    userId: string;
}
