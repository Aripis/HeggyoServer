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
export class UpdateInstitutionInput {
    // FIXME: shouldn't have id - get it automatically from @CurrentUser in resolver
    // but the way of knowing currInstitution has to be created
    @Field()
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    @IsEmail()
    email?: string;

    @Field(() => InstitutionType, { nullable: true })
    type?: InstitutionType;

    @Field(() => EducationStage, { nullable: true })
    educationalStage?: EducationStage;

    @Field({ nullable: true })
    alias?: string;
}
