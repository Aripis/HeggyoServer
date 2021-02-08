import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { WeekDays } from 'src/schedule/schedule.model';

registerEnumType(WeekDays, {
    name: 'WeekDays',
});

@InputType()
export class CreateScheduleInput {
    @Field()
    startTime: Date;

    @Field()
    endTime: Date;

    @Field(() => WeekDays)
    day: WeekDays;

    @Field()
    subjectUUID: string;

    @Field()
    classUUID: string;

    @Field(() => [String], { nullable: true })
    teachersUUIDs?: string[];

    @Field()
    room: string;
}
