import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { UserRoles } from '../user.model';

registerEnumType(UserRoles, { name: 'UserRoles' });

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
    email?: string;

    @Field({ nullable: true })
    photo?: UploadScalar;
}
