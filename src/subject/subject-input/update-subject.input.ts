import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateSubjectInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field(() => Int, { nullable: true })
    startYear?: number;

    @Field(() => Int, { nullable: true })
    endYear?: number;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [String], { nullable: true })
    teachersIds?: string[];

    @Field({ nullable: true })
    @IsUUID('all')
    classId?: string;
}
