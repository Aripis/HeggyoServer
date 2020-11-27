import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ContractType } from '../teacher.model';

registerEnumType(ContractType, {
    name: 'ContractType',
});

@InputType()
export class UpdateTeacherInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    education?: string;

    @Field(() => Int, { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    contractType?: ContractType;
}
