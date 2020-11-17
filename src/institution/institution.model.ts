/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Field,
    InputType,
    registerEnumType,
    ID,
    ObjectType,
} from '@nestjs/graphql';
import { Type, EducationStage, Status } from './institution.entity';

registerEnumType(Type, {
    name: 'Type',
});

registerEnumType(Status, {
    name: 'Status',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@ObjectType()
export class Institution {
    @Field()
    public createdAt: Date;

    @Field()
    public updatedAt: Date;

    @Field(() => ID)
    id: string;

    @Field({ nullable: false })
    name: string;

    @Field({ nullable: false })
    email: string;

    @Field(() => Type, { nullable: false })
    type: Type;

    @Field({ nullable: false })
    capacityPerClass: number;

    @Field(() => EducationStage, { nullable: false })
    educationalStage: EducationStage;

    @Field({ nullable: false })
    token: string;

    @Field({ nullable: false })
    tokenStatus: Status;
}
