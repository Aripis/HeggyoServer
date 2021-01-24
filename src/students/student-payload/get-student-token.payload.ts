import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetStudentTokenPayload {
    constructor(private readonly Stoken: string) {
        this.token = Stoken;
    }

    @Field()
    token: string;
}
