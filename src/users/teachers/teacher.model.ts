/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ContractType } from './teacher.entity';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@ObjectType()
export class User {
    @Field({ nullable: false })
    education: string;

    @Field({ nullable: false })
    workExperience: number;

    @Field(type => ContractType)
    contractType: ContractType;
}
