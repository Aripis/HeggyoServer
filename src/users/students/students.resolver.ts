import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentInput } from './student.input';

import { Student } from './student.model';
import { StudentsService } from './students.service';

@Resolver(() => Student)
export class StudentsResolver {
    constructor(private readonly studentsService: StudentsService) {}

    @Query(() => Student)
    async student(@Args('id') uuid: string): Promise<Student> {
        return await this.studentsService.findOne(uuid);
    }

    @Query(() => [Student])
    async students(): Promise<Student[]> {
        return await this.studentsService.findAll();
    }

    // TODO: create for each mutation Payload
    @Mutation(() => Boolean)
    async removeStudent(@Args('id') uuid: string) {
        return this.studentsService.remove(uuid);
    }

    // TODO: create for each mutation Payload
    @Mutation(() => Student)
    async updateStudent(
        @Args('studentData') studentData: StudentInput,
    ): Promise<Student> {
        // TODO: Fix this
        const student = new Student();

        Object.assign(student, studentData);
        return this.studentsService.update(student);
    }
}
