/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class UserInput {
    @Field()
    @MaxLength(50)
    firstName: string;

    @Field()
    @MaxLength(50)
    middleName: string;

    @Field()
    @MaxLength(50)
    lastName: string;

    @Field()
    email: string;

    @Field()
    @MinLength(7)
    password: string;

    @Field({ nullable: true })
    registerToken?: string;
}
