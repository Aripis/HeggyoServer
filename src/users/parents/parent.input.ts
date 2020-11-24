import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ParentInput {
    @Field()
    parentToken: string;
}
