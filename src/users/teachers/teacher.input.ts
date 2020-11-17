/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ID } from '@nestjs/graphql';
import { ContractType } from './teacher.model';

@InputType()
export class UserInput {
    @Field({ nullable: false })
    education: string;

    @Field({ nullable: false })
    workExperience: number;

    @Field({ nullable: false })
    contractType: ContractType;
}
