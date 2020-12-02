import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';

import { Teacher } from './teacher.model';
import { TeachersService } from './teachers.service';

@Resolver(() => Teacher)
export class TeachersResolver {
    constructor(private readonly teachersService: TeachersService) {}

    @Query(() => Teacher)
    teacher(@Args('id') uuid: string): Promise<Teacher> {
        return this.teachersService.findOne(uuid);
    }

    @Query(() => [Teacher])
    teachers(): Promise<Teacher[]> {
        return this.teachersService.findAll();
    }

    @Mutation(() => UpdateTeacherPayload)
    updateTeacher(
        @Args('teacherData') teacherData: UpdateTeacherInput,
    ): Promise<UpdateTeacherPayload> {
        return this.teachersService.update(teacherData);
    }
}
