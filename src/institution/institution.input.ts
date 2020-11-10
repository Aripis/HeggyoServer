/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Type, EducationStage } from './institution.entity';

registerEnumType(Type, {
    name: 'Type',
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

    @Field(type => Type, { nullable: false })
    type: Type;

    @Field({ nullable: false })
    capacityPerClass: number;

    @Field(type => EducationStage, { nullable: false })
    educationalStage: EducationStage;
}
