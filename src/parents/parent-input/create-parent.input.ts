import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateParentInput {
    @Field()
    parentToken: string;
}
