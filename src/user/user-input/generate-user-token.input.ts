import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../user.model';
import { IsUUID } from 'class-validator';

registerEnumType(UserRole, { name: 'UserRole' });

@InputType()
export class GenerateUserTokenInput {
    @Field({ nullable: true })
    @IsUUID('all')
    classId?: string;

    @Field(() => UserRole, { nullable: true })
    role?: UserRole;
}
