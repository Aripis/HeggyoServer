import { InstitutionType, EducationStage } from '../institution.model';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@InputType()
export class AddInstitutionInput {
    @Field()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field(() => InstitutionType)
    type: InstitutionType;

    @Field(() => EducationStage)
    educationalStage: EducationStage;

    @Field()
    alias: string;
}
