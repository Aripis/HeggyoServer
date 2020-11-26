import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy:
                process.env.NODE_ENV === 'production' ? undefined : false,
        }),
    );
    app.use(cookieParser(configService.get('COOKIE_SECRET')));
    app.enableCors({ origin: process.env.NODE_ENV === 'production' ? [/^https:\/\/heggyo-client.*\.vercel\.app$/] : "http://localhost:3000", exposedHeaders: ['Authorization'], credentials: true });

    await app.listen(8080);
};

bootstrap();
