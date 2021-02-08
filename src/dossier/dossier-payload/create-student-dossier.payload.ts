import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateStudentDossierPayload {
    constructor(private readonly uuid: string) {
        this.dossierId = uuid;
    }

    @Field()
    dossierId: string;
}
