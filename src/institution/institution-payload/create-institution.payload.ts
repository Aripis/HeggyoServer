import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateInstitutionPayload {
    constructor(private readonly uuid: string) {
        this.institutionId = uuid;
    }

    @Field()
    institutionId: string;
}
