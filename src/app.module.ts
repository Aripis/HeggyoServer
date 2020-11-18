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
        GraphQLModule.forRoot({
            installSubscriptionHandlers: true,
            autoSchemaFile: 'schema.gql',
            context: ({ req, res }) => ({ req, res }),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
