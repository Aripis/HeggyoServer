import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateInstitutionPayload {
    constructor(private readonly uuid: string) {
        this.institutionId = uuid;
    }

    @Field()
    institutionId: string;
}
