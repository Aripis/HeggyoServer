import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginInput } from './login.input';
import { ConfigService } from '@nestjs/config';
import { Token } from './token.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findOne(email);
        if (user) {
            if (await bcrypt.compare(pass, user.password)) {
                // try {
                //     this.jwtService.verify(
                //         user.refreshToken,
                //         this.configService.get<JwtVerifyOptions>('JWT_SECRET'),
                //     );
                // } catch (error) {
                //     user.refreshToken = this.jwtService.sign(
                //         {},
                //         { expiresIn: '100d' },
                //     );
                // }
                // this.usersService.update(user);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return result;
            }
            throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }

    async login(loginData: LoginInput): Promise<Token> {
        const result = await this.validateUser(
            loginData.email,
            loginData.password,
        );
        const payload = { email: result.email, sub: result.id };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: '',
        };
    }
}
