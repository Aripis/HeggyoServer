import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateStudentInput } from './student-input/update-student.input';
import { UpdateStudentPayload } from './student-payload/update-student.payload';

import { Student } from './student.model';
import { StudentsService } from './students.service';

@Resolver(() => Student)
export class StudentsResolver {
    constructor(private readonly studentsService: StudentsService) {}

    @Query(() => Student)
    student(@Args('id') uuid: string): Promise<Student> {
        return this.studentsService.findOne(uuid);
    }

    @Query(() => [Student])
    students(): Promise<Student[]> {
        return this.studentsService.findAll();
    }

    @Mutation(() => UpdateStudentPayload)
    updateStudent(
        @Args('studentData') studentData: UpdateStudentInput,
    ): Promise<UpdateStudentPayload> {
        return this.studentsService.update(studentData);
    }
}
