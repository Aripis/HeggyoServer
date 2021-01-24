import { Field, InputType, registerEnumType, Int } from '@nestjs/graphql';
import { InstitutionType, EducationStage } from '../institution.model';

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@InputType()
export class UpdateInstitutionInput {
    // FIXME: shouldn't have id - get it automatically from @CurrentUser in resolver
    // but the way of knowing currInstitution has to be created
    @Field()
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field(() => InstitutionType, { nullable: true })
    type?: InstitutionType;

    @Field(() => Int, { nullable: true })
    capacityPerClass?: number;

    @Field(() => EducationStage, { nullable: true })
    educationalStage?: EducationStage;

    @Field({ nullable: true })
    alias?: string;
}
