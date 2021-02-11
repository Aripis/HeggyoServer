import { FindOneStudentDossierPayload } from 'src/student-dossier/student-dossier-payload/find-one-student-dossier.payload';
import { AddStudentDossierInput } from './student-dossier-input/add-student-dossier.input';
import { StudentDossierPayload } from './student-dossier-payload/student-dossier.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentDossierService } from './student-dossier.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { StudentDossier } from './student-dossier.model';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';

@Resolver(() => StudentDossier)
export class StudentDossierResolver {
    constructor(
        private readonly studentDossierService: StudentDossierService,
    ) {}

    @Query(() => FindOneStudentDossierPayload)
    @UseGuards(GqlAuthGuard)
    getStudentDossier(
        @Args('studentId') studentId: string,
    ): Promise<FindOneStudentDossierPayload> {
        return this.studentDossierService.findOne(studentId);
    }

    @Query(() => [StudentDossier])
    @UseGuards(GqlAuthGuard)
    getAllStudentDossiers(
        @CurrentUser() currUser: User,
    ): Promise<StudentDossier[]> {
        return this.studentDossierService.findAll(currUser);
    }

    @Mutation(() => StudentDossierPayload)
    @UseGuards(GqlAuthGuard)
    addStudentDossier(
        @Args('input')
        input: AddStudentDossierInput,
        @CurrentUser() currUser: User,
    ): Promise<StudentDossierPayload> {
        return this.studentDossierService.add(input, currUser);
    }
}
