import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
    @Field(() => Int)
    startYear;

    @Field(() => Int)
    endYear;

    @Field()
    startTime: string;

    @Field()
    endTime: string;

    @Field(() => [String])
    subjectUUIDs: string[];

    @Field(() => String)
    classUUID: string;

    @Field(() => [String], { nullable: true })
    teacherUUIDs?: string[];
}
