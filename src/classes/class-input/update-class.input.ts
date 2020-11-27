import { Field, InputType, Int } from '@nestjs/graphql';

// import { Teacher } from 'src/users/teachers/teacher.model';
import { TokenStatus } from '../class.model';

@InputType()
export class UpdateClassInput {
    @Field()
    id: string;

    @Field(() => Int, { nullable: true })
    totalStudentCount?: number;

    // @Field(() => Teacher, { nullable: true })
    // classTeacher?: Teacher;

    @Field({ nullable: true })
    classLetter?: string;

    @Field(() => Int, { nullable: true })
    classNumber?: number;

    @Field({ nullable: true })
    classToken?: string;

    @Field(() => TokenStatus, { nullable: true })
    classTokenStatus?: TokenStatus;
}
