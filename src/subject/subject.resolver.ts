import { UpdateSubjectInput } from './subject-input/update-subject.input';
import { AddSubjectInput } from './subject-input/add-subject.input';
import { SubjectPayload } from './subject-payload/subject.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { SubjectService } from './subject.service';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';
import { Subject } from './subject.model';

@Resolver(() => Subject)
export class SubjectResolver {
    constructor(private readonly subjectService: SubjectService) {}

    @Query(() => Subject)
    @UseGuards(GqlAuthGuard)
    getSubject(@Args('id') id: string): Promise<Subject> {
        return this.subjectService.findOne(id);
    }

    @Query(() => [Subject])
    @UseGuards(GqlAuthGuard)
    getAllSubjects(@CurrentUser() currUser: User): Promise<Subject[]> {
        return this.subjectService.findAll(currUser);
    }

    @Mutation(() => SubjectPayload)
    @UseGuards(GqlAuthGuard)
    addSubject(
        @Args('input') input: AddSubjectInput,
        @CurrentUser() currUser: User,
    ): Promise<SubjectPayload> {
        return this.subjectService.add(input, currUser);
    }

    @Mutation(() => SubjectPayload)
    @UseGuards(GqlAuthGuard)
    updateSubject(
        @Args('input') input: UpdateSubjectInput,
    ): Promise<SubjectPayload> {
        return this.subjectService.update(input);
    }
}
