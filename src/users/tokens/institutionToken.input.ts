/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class InstitutionTokenInput {
    @Field({ nullable: false })
    token: string;
}
