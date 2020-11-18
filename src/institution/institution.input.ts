/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Field,
    InputType,
    registerEnumType,
    ObjectType,
} from '@nestjs/graphql';
import { InstitutionType, EducationStage } from './institution.model';

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@InputType()
export class InstitutionInput {
    @Field({ nullable: false })
    name: string;

    @Field({ nullable: false })
    email: string;

    @Field(type => InstitutionType, { nullable: false })
    type: InstitutionType;

    @Field({ nullable: false })
    capacityPerClass: number;

    @Field(type => EducationStage, { nullable: false })
    educationalStage: EducationStage;
}
