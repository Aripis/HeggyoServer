import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { WeekDays } from 'src/schedule/schedule.model';

registerEnumType(WeekDays, {
    name: 'WeekDays',
});

@InputType()
export class AddScheduleInput {
    @Field()
    startTime: Date;

    @Field()
    endTime: Date;

    @Field(() => WeekDays)
    day: WeekDays;

    @Field()
    subjectId: string;

    @Field()
    classId: string;

    @Field(() => [String], { nullable: true })
    teachersIds?: string[];

    @Field()
    room: string;
}
