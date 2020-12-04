import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    createSubject(
        createSubjectData: CreateSubjectInput,
    ): Promise<CreateSubjectPayload> {
        return this.subjectService.create(createSubjectData);
    }
    @Mutation(() => UpdateSubjectPayload)
    updateSubject(
        @Args('studentData') studentData: UpdateSubjectInput,
    ): Promise<UpdateSubjectPayload> {
        return this.subjectService.update(studentData);
    }
}
