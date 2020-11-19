/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ContractType } from './teacher.model';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@InputType()
export class UserInput {
    @Field({ nullable: true })
    education?: string;

    @Field(() => Int, { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    contractType?: ContractType;
}
