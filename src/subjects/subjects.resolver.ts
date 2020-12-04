import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { CreateSubjectInput } from './subject-input/create-subject.input';
import { UpdateSubjectInput } from './subject-input/update-subject.input';
import { CreateSubjectPayload } from './subject-payload/create-subject.payload';
import { UpdateSubjectPayload } from './subject-payload/update-subject.payload';
import { Subject } from './subject.model';
import { SubjectService } from './subjects.service';

@Resolver(() => Subject)
export class SubjectsResolver {
    constructor(private readonly subjectService: SubjectService) {}

    @Query(() => Subject)
    subject(@Args('id') uuid: string): Promise<Subject> {
        return this.subjectService.findOne(uuid);
    }

    @Query(() => [Subject])
    subjects(): Promise<Subject[]> {
        return this.subjectService.findAll();
    }

    @Mutation(() => CreateSubjectPayload)
    @UseGuards(GqlAuthGuard)
    createSubject(
        @Args('subjectData') createSubjectData: CreateSubjectInput,
        @CurrentUser() currUser: User,
    ): Promise<CreateSubjectPayload> {
        return this.subjectService.create(createSubjectData, currUser.id);
    }

    @Mutation(() => UpdateSubjectPayload)
    updateSubject(
        @Args('subjectData') studentData: UpdateSubjectInput,
    ): Promise<UpdateSubjectPayload> {
        return this.subjectService.update(studentData);
    }
}
