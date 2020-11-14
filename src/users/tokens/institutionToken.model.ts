/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ID, ObjectType } from '@nestjs/graphql';
// import {} from './institutionToken.entity';

@InputType()
// @ObjectType()
export class InstitutionToken {
    @Field()
    public createdAt: Date;

    @Field()
    public updatedAt: Date;

    @Field(type => ID)
    id: number;

    @Field({ nullable: false })
    name: string;

    @Field({ nullable: false })
    email: string;

    @Field({ nullable: false })
    capacityPerClass: number;
}
