/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
    @Field({ nullable: false })
    accessToken: string;

    @Field({ nullable: false })
    refreshToken: string;
}
