import { UpdateStudentRecordInput } from './student-input/update-student-record.input';
import { GetStudentTokenPayload } from './student-payload/get-student-token.payload';
import { UpdateStudentInput } from './student-input/update-student.input';
import { StudentPayload } from './student-payload/student.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { StudentService } from './student.service';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';
import { Student } from './student.model';

@Resolver(() => Student)
export class StudentResolver {
    constructor(private readonly studentService: StudentService) {}

    @Query(() => Student)
    @UseGuards(GqlAuthGuard)
    getStudent(@Args('id') id: string): Promise<Student> {
        return this.studentService.findOne(id);
    }

    @Query(() => [Student])
    @UseGuards(GqlAuthGuard)
    getAllStudents(@CurrentUser() currUser: User): Promise<Student[]> {
        return this.studentService.findAll(currUser);
    }

    @Query(() => GetStudentTokenPayload)
    @UseGuards(GqlAuthGuard)
    getStudentToken(
        @CurrentUser() currUser: User,
    ): Promise<GetStudentTokenPayload> {
        return this.studentService.getToken(currUser);
    }

    @Mutation(() => StudentPayload)
    @UseGuards(GqlAuthGuard)
    updateStudent(
        @Args('input') input: UpdateStudentInput,
    ): Promise<StudentPayload> {
        return this.studentService.update(input);
    }

    @Mutation(() => StudentPayload)
    @UseGuards(GqlAuthGuard)
    updateStudentRecord(
        @Args('input') input: UpdateStudentRecordInput,
    ): Promise<StudentPayload> {
        return this.studentService.updateRecord(input);
    }
}
