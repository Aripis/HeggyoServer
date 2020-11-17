/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
    @Field({ nullable: false })
    email: string;

    @Field({ nullable: false })
    password: string;
}
