import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateScheduleInput } from './schedule-input/create-schedule.input';
import { CreateSchedulePayload } from './schedule-payload/create-schedule.payload';
import { Schedule } from './schedule.model';
import { ScheduleService } from './schedule.service';

@Resolver(() => Schedule)
export class ScheduleResolver {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Query(() => Schedule)
    schedule(@Args('id') uuid: string): Promise<Schedule> {
        return this.scheduleService.findOne(uuid);
    }

    @Query(() => [Schedule])
    schedules(): Promise<Schedule[]> {
        return this.scheduleService.findAll();
    }

    @Mutation(() => CreateSchedulePayload)
    createSchedule(
        @Args() scheduleInput: CreateScheduleInput,
    ): Promise<CreateSchedulePayload> {
        return this.scheduleService.create(scheduleInput);
    }
}
