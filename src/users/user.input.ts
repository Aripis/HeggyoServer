/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ID } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Status } from './user.entity';

@InputType()
export class UserInput {
    @Field()
    public createdAt: Date;

    @Field()
    public updatedAt: Date;

    @Field(type => ID)
    id: number;

    @Field({ nullable: false })
    @MaxLength(50)
    firstName: string;

    @Field({ nullable: false })
    @MaxLength(50)
    middleName: string;

    @Field({ nullable: false })
    @MaxLength(50)
    lastName: string;

    @Field({ nullable: false })
    @MaxLength(25)
    userName: string;

    @Field({ nullable: false })
    email: string;

    @Field({ nullable: false })
    password: string;

    @Field({ nullable: false })
    userRole: string;

    @Field(type => Status)
    status: Status;

    @Field({ nullable: false })
    institutionId: number;
}
