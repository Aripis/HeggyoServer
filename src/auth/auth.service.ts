import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
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

    async validateUser(email: string, pass: string, refreshToken: string) {
        const user = await this.usersService.findOne(email);
        if (user) {
            if (await bcrypt.compare(pass, user.password)) {
                try {
                    this.jwtService.verify(
                        refreshToken,
                        this.configService.get<JwtVerifyOptions>('JWT_SECRET'),
                    );
                } catch (error) {
                    refreshToken = this.jwtService.sign(
                        {},
                        {
                            expiresIn: `${this.configService.get<number>(
                                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
                            )}s`,
                        },
                    );
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return { ...result, refreshToken };
            }
            throw new BadRequestException('Invalid password');
        } else {
            throw new NotFoundException('Not found');
        }
    }

    async login(loginData: LoginInput, refreshToken: string): Promise<Token> {
        const result = await this.validateUser(
            loginData.email,
            loginData.password,
            refreshToken,
        );
        const payload = { email: result.email, sub: result.id };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: result.refreshToken,
        };
    }
}
