/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../user.entity';
import { ContractType } from './teacher.entity';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@ObjectType()
export class Teacher {
    @Field(() => User)
    user: User;

    @Field(() => ID)
    id: string;

    @Field({ nullable: false })
    education: string;

    @Field({ nullable: false })
    workExperience: number;

    @Field(() => ContractType)
    contractType: ContractType;
}
