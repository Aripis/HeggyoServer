import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveSchedulePayload {
    constructor(private readonly uuid: string) {
        this.scheduleId = uuid;
    }

    @Field()
    scheduleId: string;
}
