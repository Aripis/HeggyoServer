import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateUserTokenPayload {
    constructor(private readonly token: string) {
        this.userRoleToken = token;
    }

    @Field()
    userRoleToken: string;
}
