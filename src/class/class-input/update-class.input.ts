import { Field, InputType, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { TokenStatus } from '../class.model';

@InputType()
export class UpdateClassInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field(() => Int, { nullable: true })
    totalStudentCount?: number;

    @Field({ nullable: true })
    @IsUUID('all')
    teacherId?: string;

    @Field({ nullable: true })
    letter?: string;

    @Field(() => Int, { nullable: true })
    number?: number;

    @Field({ nullable: true })
    token?: string;

    @Field(() => TokenStatus, { nullable: true })
    tokenStatus?: TokenStatus;
}
