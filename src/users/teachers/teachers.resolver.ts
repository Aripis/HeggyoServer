import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeacherInput } from './teacher.input';

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

    @Mutation(() => Boolean)
    async removeUser(@Args('id') uuid: string) {
        return this.teachersService.remove(uuid);
    }

    @Mutation(() => Teacher)
    async updateTeacher(
        @Args('teacherData') teacherData: TeacherInput,
    ): Promise<Teacher> {
        return this.teachersService.update(teacherData);
    }
}
