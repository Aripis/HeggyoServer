import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { UserRoles } from '../user.model';

registerEnumType(UserRoles, { name: 'UserRoles' });

@InputType()
export class UpdateUserInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    @MaxLength(50)
    firstName?: string;

    @Field({ nullable: true })
    @MaxLength(50)
    middleName?: string;

    @Field({ nullable: true })
    @MaxLength(50)
    lastName?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    @MinLength(7)
    password?: string;

    @Field(() => UserRoles, { nullable: true })
    userRole: UserRoles;
}
