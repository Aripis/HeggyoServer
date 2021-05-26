import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { AddGradeInput } from './grade-input/add-grade.input';
import { GradePayload } from './grade-payload/grade.payload';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GradeService } from './grade.service';
import { StudentGrade } from './grade.model';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class GradeResolver {
    constructor(private readonly gradeService: GradeService) {}

    @Query(() => [StudentGrade])
    @UseGuards(GqlAuthGuard)
    getAllStudentGrades(
        @Args('studentId') studentId: string,
    ): Promise<StudentGrade[]> {
        return this.gradeService.findAllForOneStudent(studentId);
    }

    @Query(() => [StudentGrade])
    @UseGuards(GqlAuthGuard)
    getAllGrades(@CurrentUser() currUser: User): Promise<StudentGrade[]> {
        return this.gradeService.findAllByInstruction(currUser);
    }

    @Query(() => [StudentGrade])
    @UseGuards(GqlAuthGuard)
    getAllGradesPerClassPerSubject(
        @Args('classId') classId: string,
        @Args('subjectId') subjectId: string,
    ): Promise<StudentGrade[]> {
        return this.gradeService.findAllForOneSubject(subjectId);
    }

    @Mutation(() => GradePayload)
    @UseGuards(GqlAuthGuard)
    addGrade(
        @Args('input') input: AddGradeInput,
        @CurrentUser() user: User,
    ): Promise<GradePayload> {
        return this.gradeService.add(input, user);
    }
}
