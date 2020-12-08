import { Field, InputType, Int } from '@nestjs/graphql';
import { Class } from 'src/classes/class.model';

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

    @Field(() => [String], { nullable: true })
    teachersUUID?: string[];

    @Field({ nullable: true })
    classUUID?: string;
}
