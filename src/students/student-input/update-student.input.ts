import { Field, InputType } from '@nestjs/graphql';
// import { Class } from 'src/classes/class.model';

@InputType()
export class UpdateStudentInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    startDate?: Date;

    // @Field(() => Class, { nullable: true })
    // class?: Class;

    @Field({ nullable: true })
    prevEducation?: string;
}
