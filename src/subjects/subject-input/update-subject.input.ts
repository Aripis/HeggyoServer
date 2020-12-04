import { Field, InputType, Int } from '@nestjs/graphql';
// import { Teacher } from 'src/teachers/teacher.model';

@InputType()
export class UpdateSubjectInput {
    @Field()
    id: string;

    @Field(() => Int, { nullable: true })
    startYear: number;

    @Field(() => Int, { nullable: true })
    endYear: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    description: string;

    // TODO: make it work
    // @Field(() => [Teacher], { nullable: true })
    // teachers?: Teacher[];
}
