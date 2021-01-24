import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserStatus } from '../user.model';

registerEnumType(UserStatus, { name: 'UserStatus' });

@InputType()
export class UpdateUserStatusInput {
    @Field()
    id: string;

    @Field(() => UserStatus)
    userStatus: UserStatus;
}
