import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { IsEmail, MaxLength } from 'class-validator';
import { UserRole } from '../user.model';

registerEnumType(UserRole, { name: 'UserRole' });

@InputType()
export class UpdateUserInput {
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
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    photo?: UploadScalar;
}
