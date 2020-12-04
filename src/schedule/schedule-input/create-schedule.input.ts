import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
    @Field()
    startTime: string;

    @Field()
    endTime: string;

    @Field(() => String)
    subjectUUID: string;

    @Field(() => String)
    classUUID: string;

    @Field(() => [String], { nullable: true })
    teacherUUIDs?: string[];
}
