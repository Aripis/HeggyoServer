import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { TeacherPayload } from './teacher-payload/teacher.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { TeacherService } from './teacher.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.model';
import { Teacher } from './teacher.model';

@Resolver(() => Teacher)
export class TeacherResolver {
    constructor(private readonly teacherService: TeacherService) {}

    @Query(() => Teacher)
    @UseGuards(GqlAuthGuard)
    getTeacher(@Args('id') id: string): Promise<Teacher> {
        return this.teacherService.findOne(id);
    }

    @Query(() => [Teacher])
    @UseGuards(GqlAuthGuard)
    getAllTeachers(@CurrentUser() currUser: User): Promise<Teacher[]> {
        return this.teacherService.findAll(currUser);
    }

    @Query(() => [Teacher])
    @UseGuards(GqlAuthGuard)
    getAllAvailableClassTeachers(
        @CurrentUser() currUser: User,
        @Args('classId', { nullable: true }) classId?: string,
    ): Promise<Teacher[]> {
        return this.teacherService.findAvailableClassTeachers(
            currUser,
            classId,
        );
    }

    @Mutation(() => TeacherPayload)
    @UseGuards(GqlAuthGuard)
    updateTeacher(
        @Args('input') input: UpdateTeacherInput,
    ): Promise<TeacherPayload> {
        return this.teacherService.update(input);
    }
}
