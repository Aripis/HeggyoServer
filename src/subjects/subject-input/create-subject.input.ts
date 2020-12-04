import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSubjectInput {
    @Field(() => Int)
    startYear: number;

    @Field(() => Int)
    endYear: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field({ nullable: true })
    teachersUUID?: string;
}
