import { Field, ObjectType } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@ObjectType()
export class Token {
    @Field()
    @IsJWT()
    accessToken: string;

    @Field({ nullable: true })
    @IsJWT()
    refreshToken?: string;
}
