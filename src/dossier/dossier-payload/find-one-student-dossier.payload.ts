import { Field, ObjectType } from '@nestjs/graphql';
import { BufferScalar } from 'src/common/scalars/buffer.scalar';
import { StudentDossier } from '../student_dossier.model';

@ObjectType()
export class FindOneStudentDossierPayload {
    constructor(
        private readonly inputDossiers: StudentDossier[],
        private readonly inputBufferArray: Buffer[],
    ) {
        this.dossiers = inputDossiers;
        this.bufferArray = inputBufferArray;
    }

    @Field(() => [StudentDossier])
    dossiers: StudentDossier[];

    @Field(() => [Buffer])
    bufferArray: Buffer[];
}
