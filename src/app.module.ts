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
import { SubjectsModule } from './subjects/subjects.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MessageModule } from './messages/message.module';
import { StudentDossierModule } from './dossier/student-dossier.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GradeModule } from './grades/grade.module';
import { GCloudStorageModule } from '@aginix/nestjs-gcloud-storage';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [initDB] }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.get('database'),
        }),
        GraphQLModule.forRoot({
            installSubscriptionHandlers: true,
            autoSchemaFile:
                process.env.NODE_ENV === 'production' ? true : 'schema.gql',
            context: ({ req, res }) => ({ req, res }),
            cors: {
                origin:
                    process.env.NODE_ENV === 'production'
                        ? [/^https:\/\/heggyo-client.*\.vercel\.app$/]
                        : 'http://localhost:3000',
                credentials: true,
            },
        }),
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    service: 'gmail',
                    auth: {
                        user: configService.get('EMAIL_USERNAME'),
                        pass: configService.get('EMAIL_PASSWORD'),
                    },
                },
                template: {
                    dir: process.cwd() + '/views/email/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
        GCloudStorageModule.withConfigAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                defaultBucketname: config.get('GCS_BUCKET_NAME'),
                storageBaseUri: config.get('GCS_DOMAIN_NAME'),
            }),
            imports: [ConfigModule],
        }),
        UsersModule,
        AuthModule,
        InstitutionsModule,
        ClassesModule,
        SubjectsModule,
        ScheduleModule,
        MessageModule,
        StudentDossierModule,
        GradeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
