import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddClassInput {
    @Field(() => Int)
    startYear: number;

    @Field(() => Int)
    endYear: number;

    @Field(() => Int)
    totalStudentCount: number;

    @Field(() => Int)
    number: number;

    @Field()
    letter: string;

    @Field({ nullable: true })
    @IsUUID('all')
    teacherId: string;
}
