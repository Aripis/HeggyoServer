import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    middleName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    userRole: string;

    @IsNotEmpty()
    institutionId: number;
}
