import { Field, InputType, registerEnumType, Int } from '@nestjs/graphql';
import { InstitutionType, EducationStage } from './institution.model';

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@InputType()
export class InstitutionInput {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field(() => InstitutionType)
    type: InstitutionType;

    @Field(() => Int, { nullable: true })
    capacityPerClass?: number;

    @Field(() => EducationStage)
    educationalStage: EducationStage;

    @Field()
    alias: string;
}
