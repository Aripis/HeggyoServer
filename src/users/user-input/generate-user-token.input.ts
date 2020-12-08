import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserRoles } from '../user.model';

registerEnumType(UserRoles, { name: 'UserRoles' });

@InputType()
export class GenerateUserTokenInput {
    @Field({ nullable: true })
    classUUID?: string;

    @Field(() => UserRoles, { nullable: true })
    userRole?: UserRoles;
}
