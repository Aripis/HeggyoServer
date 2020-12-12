import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';

import { Teacher } from './teacher.model';
import { TeachersService } from './teachers.service';

@Resolver(() => Teacher)
export class TeachersResolver {
    constructor(private readonly teachersService: TeachersService) {}

    @Query(() => Teacher)
    @UseGuards(GqlAuthGuard)
    teacher(@Args('id') uuid: string): Promise<Teacher> {
        return this.teachersService.findOne(uuid);
    }

    @Query(() => [Teacher])
    @UseGuards(GqlAuthGuard)
    teachers(@CurrentUser() currUser: User): Promise<Teacher[]> {
        return this.teachersService.findAll(currUser);
    }

    @Mutation(() => UpdateTeacherPayload)
    @UseGuards(GqlAuthGuard)
    updateTeacher(
        @Args('teacherData') teacherData: UpdateTeacherInput,
    ): Promise<UpdateTeacherPayload> {
        return this.teachersService.update(teacherData);
    }
}
