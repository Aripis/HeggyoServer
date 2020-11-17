/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status } from './user.entity';

registerEnumType(Status, {
    name: 'Status',
});

@ObjectType()
export class User {
    @Field()
    public createdAt: Date;

    @Field()
    public updatedAt: Date;

    @Field(type => ID)
    id: number;

    @Field({ nullable: false })
    firstName: string;

    @Field({ nullable: false })
    middleName: string;

    @Field({ nullable: false })
    lastName: string;

    @Field({ nullable: false })
    userName: string;

    @Field({ nullable: false })
    email: string;

    @Field({ nullable: false })
    password: string;

    @Field({ nullable: false })
    userRole: string;

    @Field(type => Status, { nullable: false })
    status: Status;

    @Field({ nullable: false })
    institutionId: number;

    @Field({ nullable: false })
    registerToken: string;
}
