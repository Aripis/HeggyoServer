/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Field,
    InputType,
    registerEnumType,
    ObjectType,
} from '@nestjs/graphql';
import { Type, EducationStage } from './institution.entity';

registerEnumType(Type, {
    name: 'Type',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@InputType()
// @ObjectType()
export class InstitutionInput {
    @Field({ nullable: false })
    name: string;

    @Field({ nullable: false })
    email: string;

    @Field(type => Type, { nullable: false })
    type: Type;

    @Field({ nullable: false })
    capacityPerClass: number;

    @Field(type => EducationStage, { nullable: false })
    educationalStage: EducationStage;
}
