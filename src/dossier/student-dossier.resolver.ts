import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { CreateStudentDossierInput } from './dossier-input/create-student-dossier.input';
import { CreateStudentDossierPayload } from './dossier-payload/create-student-dossier.payload';
import { StudentDossier } from './student_dossier.model';
import { StudentDossierService } from './student-dossier.service';

@Resolver(() => StudentDossier)
export class StudentDossierResolver {
    constructor(
        private readonly studentDossierService: StudentDossierService,
    ) {}

    @Mutation(() => CreateStudentDossierPayload)
    @UseGuards(GqlAuthGuard)
    createStudentDossier(
        @Args('input')
        input: CreateStudentDossierInput,
        @CurrentUser() currUser: User,
    ): Promise<CreateStudentDossierPayload> {
        return this.studentDossierService.create(input, currUser);
    }

    @Query(() => [StudentDossier])
    @UseGuards(GqlAuthGuard)
    studentDossiers(@CurrentUser() currUser: User): Promise<StudentDossier[]> {
        return this.studentDossierService.findAll(currUser);
    }

    // @Mutation(() => UpdateMessagePayload)
    // updateMessage(
    //     @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
    // ): Promise<UpdateMessagePayload> {
    //     return this.studentDossierService.update(updateMessageInput);
    // }
}
