import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserStatus } from '../user.model';
import { IsUUID } from 'class-validator';

registerEnumType(UserStatus, { name: 'UserStatus' });

@InputType()
export class UpdateUserStatusInput {
    @Field()
    @IsUUID('all')
    id: string;

    @Field(() => UserStatus)
    userStatus: UserStatus;
}
