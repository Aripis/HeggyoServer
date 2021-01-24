/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
    @Field()
    accessToken: string;

    @Field({ nullable: true })
    refreshToken?: string;
}
