import { Field, InputType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateStudentInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    @IsUUID('all')
    classId?: string;

    @Field({ nullable: true })
    prevEducation?: string;

    @Field({ nullable: true })
    recordMessage?: string;

    @Field(() => [UploadScalar], { nullable: true })
    files?: UploadScalar[];
}
