import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { initDB } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionsModule } from './institution/institutions.module';
import { ClassesModule } from './classes/classes.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [initDB] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.get('database'),
        }),
        UsersModule,
        AuthModule,
        InstitutionsModule,
        ClassesModule,
        GraphQLModule.forRoot({
            installSubscriptionHandlers: true,
            autoSchemaFile: 'schema.gql',
            context: ({ req, res }) => ({ req, res }),
            cors: {
                origin:
                    process.env.NODE_ENV === 'production'
                        ? [/^https:\/\/heggyo-client.*\.vercel\.app$/]
                        : 'http://localhost:3000',
                credentials: true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
