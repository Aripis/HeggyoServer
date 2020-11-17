/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Field,
    InputType,
    registerEnumType,
    ID,
    ObjectType,
} from '@nestjs/graphql';
import { Status } from './class.entity';

registerEnumType(Status, {
    name: 'Status',
});

@ObjectType()
export class Class {
    @Field({ nullable: false })
    classLetter: string;

    @Field({ nullable: false })
    forYear: number;

    @Field({ nullable: false })
    totalStudentCount: number;

    @Field({ nullable: false })
    classNumber: number;

    @Field({ nullable: false })
    classTeacherId: number;

    @Field({ nullable: false })
    token: string;

    @Field({ nullable: false })
    tokenStatus: Status;
}
