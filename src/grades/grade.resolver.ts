import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GradeService } from './grade.service';
import { StudentGrade } from './grade.model';
import { StudentsService } from 'src/students/students.service';
import { AddGradeInput } from './grade-input/add-grade.input';
import { GradePayload } from './grade-payload/grade.payload';
import { User } from 'src/users/user.model';

@Resolver()
export class GradeResolver {
    constructor(
        private readonly gradeService: GradeService,
        private readonly studentsService: StudentsService,
    ) {}

    @Query(() => [StudentGrade])
    @UseGuards(GqlAuthGuard)
    studentGrades(
        @Args('studentUUID') studentUUID: string,
        @CurrentUser() currUser: User,
    ): Promise<StudentGrade[]> {
        return this.gradeService.findAllForOneStudent(studentUUID, currUser);
    }

    @Query(() => [StudentGrade])
    @UseGuards(GqlAuthGuard)
    gradesPerClassPerSubject(
        @Args('classId') classId: string,
        @Args('subjectId') subjectId: string,
    ): Promise<StudentGrade[]> {
        return this.gradeService.findAllForOneSubject(subjectId, classId);
    }

    @Mutation(() => GradePayload)
    @UseGuards(GqlAuthGuard)
    addGrade(
        @Args('input') input: AddGradeInput,
        @CurrentUser() user: User,
    ): Promise<GradePayload> {
        return this.gradeService.create(input, user);
    }

    // @Mutation(() => RemoveInstitutionPayload)
    // @UseGuards(GqlAuthGuard)
    // removeInstitution(
    //     @CurrentUser() currUser: User,
    // ): Promise<RemoveInstitutionPayload> {
    //     return this.gradeService.remove(currUser);
    // }

    // @Mutation(() => UpdateInstitutionPayload)
    // @UseGuards(GqlAuthGuard)
    // updateInstitution(
    //     @Args('updateInstitutionInput')
    //     updateInstitutionInput: UpdateInstitutionInput,
    // ): Promise<UpdateInstitutionPayload> {
    //     return this.gradeService.update(updateInstitutionInput);
    // }
}
