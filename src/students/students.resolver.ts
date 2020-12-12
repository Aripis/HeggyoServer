import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { UpdateStudentInput } from './student-input/update-student.input';
import { UpdateStudentPayload } from './student-payload/update-student.payload';

import { Student } from './student.model';
import { StudentsService } from './students.service';

@Resolver(() => Student)
export class StudentsResolver {
    constructor(private readonly studentsService: StudentsService) {}

    @Query(() => Student)
    @UseGuards(GqlAuthGuard)
    student(@Args('id') uuid: string): Promise<Student> {
        return this.studentsService.findOne(uuid);
    }

    @Query(() => [Student])
    @UseGuards(GqlAuthGuard)
    students(@CurrentUser() currUser: User): Promise<Student[]> {
        return this.studentsService.findAll(currUser);
    }

    @Mutation(() => UpdateStudentPayload)
    @UseGuards(GqlAuthGuard)
    updateStudent(
        @Args('studentData') studentData: UpdateStudentInput,
    ): Promise<UpdateStudentPayload> {
        return this.studentsService.update(studentData);
    }
}
