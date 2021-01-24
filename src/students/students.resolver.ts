import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { UpdateStudentRecordInput } from './student-input/update-student-record.input';
import { UpdateStudentInput } from './student-input/update-student.input';
import { GetStudentTokenPayload } from './student-payload/get-student-token.payload';
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

    @Query(() => GetStudentTokenPayload)
    @UseGuards(GqlAuthGuard)
    getStudentToken(
        @CurrentUser() currUser: User,
    ): Promise<GetStudentTokenPayload> {
        return this.studentsService.getToken(currUser);
    }

    @Mutation(() => UpdateStudentPayload)
    @UseGuards(GqlAuthGuard)
    updateStudent(
        @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
    ): Promise<UpdateStudentPayload> {
        return this.studentsService.update(updateStudentInput);
    }

    @Mutation(() => UpdateStudentPayload)
    @UseGuards(GqlAuthGuard)
    updateStudentRecord(
        @Args('updateStudentRecordInput')
        updateStudentRecordInput: UpdateStudentRecordInput,
        @CurrentUser() currUser: User,
    ): Promise<UpdateStudentPayload> {
        return this.studentsService.updateRecord(updateStudentRecordInput);
    }
}
