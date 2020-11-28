import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateStudentInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    classUUID?: string;

    @Field({ nullable: true })
    prevEducation?: string;
}
