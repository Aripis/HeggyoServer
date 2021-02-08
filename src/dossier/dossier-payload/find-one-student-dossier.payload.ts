import { Field, ObjectType } from '@nestjs/graphql';
import { StudentDossier } from '../student_dossier.model';
import { File } from '../../file/file.model';

@ObjectType()
export class FindOneStudentDossierPayload {
    constructor(
        private readonly inputDossiers: StudentDossier[],
        private readonly inputFiles: File[],
    ) {
        this.dossiers = inputDossiers;
        this.files = inputFiles;
    }

    @Field(() => [StudentDossier])
    dossiers: StudentDossier[];

    @Field(() => [File])
    files: File[];
}
