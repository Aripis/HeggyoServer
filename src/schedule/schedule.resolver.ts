import { AddScheduleInput } from './schedule-input/add-schedule.input';
import { SchedulePayload } from './schedule-payload/schedule.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.model';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.model';

@Resolver(() => Schedule)
export class ScheduleResolver {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Query(() => Schedule)
    @UseGuards(GqlAuthGuard)
    getSchedule(@Args('id') id: string): Promise<Schedule> {
        return this.scheduleService.findOne(id);
    }

    @Query(() => [Schedule])
    @UseGuards(GqlAuthGuard)
    getAllSchedules(@CurrentUser() currUser: User): Promise<Schedule[]> {
        return this.scheduleService.findAll(currUser);
    }

    @Query(() => [Schedule])
    @UseGuards(GqlAuthGuard)
    getAllSchedulesByClass(
        @Args('classId') id: string,
        @CurrentUser() currUser: User,
    ): Promise<Schedule[]> {
        return this.scheduleService.findAllByClass(id, currUser);
    }

    @Mutation(() => SchedulePayload)
    @UseGuards(GqlAuthGuard)
    addSchedule(
        @Args('input') input: AddScheduleInput,
        @CurrentUser() currUser: User,
    ): Promise<SchedulePayload> {
        return this.scheduleService.add(input, currUser);
    }

    @Mutation(() => SchedulePayload)
    @UseGuards(GqlAuthGuard)
    removeSchedule(@Args('id') id: string): Promise<SchedulePayload> {
        return this.scheduleService.remove(id);
    }

    @Mutation(() => SchedulePayload)
    @UseGuards(GqlAuthGuard)
    removeSchedulesByClass(
        @Args('classId') id: string,
    ): Promise<SchedulePayload> {
        return this.scheduleService.removeAllByClass(id);
    }
}
