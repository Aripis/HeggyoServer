import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveInstitutionPayload {
    constructor(private readonly removed: boolean) {
        this.removed = removed;
    }

    @Field()
    institutionIsRemoved: boolean;
}
