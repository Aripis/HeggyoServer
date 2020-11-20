import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
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

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findOne(email);
        if (user) {
            if (await bcrypt.compare(pass, user.password)) {
                const refreshToken = this.jwtService.sign(
                    { sub: user.id },
                    {
                        expiresIn: `${this.configService.get<number>(
                            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
                        )}s`,
                    },
                );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return { ...result, refreshToken };
            }
            throw new BadRequestException('Invalid password');
        } else {
            throw new NotFoundException('Not found');
        }
    }

    async regenerateToken(refreshToken: string) {
        try {
            this.jwtService.verify(
                refreshToken,
                this.configService.get<JwtVerifyOptions>('JWT_SECRET'),
            );
            const decodedRefreshToken = this.jwtService.decode(refreshToken);
            return this.jwtService.sign({ sub: decodedRefreshToken.sub });
        } catch (error) {
            throw new UnauthorizedException('Refresh token expired');
        }
    }

    async login(loginData: LoginInput): Promise<Token> {
        const result = await this.validateUser(
            loginData.email,
            loginData.password,
        );
        return {
            accessToken: this.jwtService.sign({ sub: result.id }),
            refreshToken: result.refreshToken,
        };
    }
}
