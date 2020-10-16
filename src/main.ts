import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.use(compression());
    app.use(helmet());
    app.enableCors();

    await app.listen(8080);
};

bootstrap();
