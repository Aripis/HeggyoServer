import { Field, ObjectType } from '@nestjs/graphql';
import { StudentDossier } from '../student-dossier.model';
import { File } from '../../file/file.model';

@ObjectType()
export class FindOneStudentDossierPayload {
    constructor(
        private readonly inputDossiers: StudentDossier[],
        private readonly inputFiles: File[],
    ) {
        this.studentDossiers = inputDossiers;
        this.files = inputFiles;
    }

    @Field(() => [StudentDossier])
    studentDossiers: StudentDossier[];

    @Field(() => [File])
    files: File[];
}
