import { Field, InputType } from '@nestjs/graphql';
import { WeekDays } from 'src/schedule/schedule.model';

@InputType()
export class CreateScheduleInput {
    @Field()
    startTime: string;

    @Field()
    endTime: string;

    @Field()
    day: WeekDays;

    @Field(() => String)
    subjectUUID: string;

    @Field(() => String)
    classUUID: string;

    @Field(() => [String], { nullable: true })
    teacherUUIDs?: string[];
}
