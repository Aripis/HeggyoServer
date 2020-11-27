import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';

import { Teacher } from './teacher.model';
import { TeachersService } from './teachers.service';

@Resolver(() => Teacher)
export class TeachersResolver {
    constructor(private readonly teachersService: TeachersService) {}

    @Query(() => Teacher)
    async teacher(@Args('id') uuid: string): Promise<Teacher> {
        return await this.teachersService.findOne(uuid);
    }

    @Query(() => [Teacher])
    async teachers(): Promise<Teacher[]> {
        return await this.teachersService.findAll();
    }

    @Mutation(() => UpdateTeacherPayload)
    async updateTeacher(
        @Args('teacherData') teacherData: UpdateTeacherInput,
    ): Promise<UpdateTeacherPayload> {
        return this.teachersService.update(teacherData);
    }
}
