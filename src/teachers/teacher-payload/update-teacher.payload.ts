import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateTeacherPayload {
    constructor(private readonly uuid: string) {
        this.teacherId = uuid;
    }

    @Field()
    teacherId: string;
}
