import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { StudentDossierModule } from './student-dossier/student-dossier.module';
import { InstitutionModule } from './institution/institution.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from './schedule/schedule.module';
import { MessageModule } from './message/message.module';
import { SubjectModule } from './subject/subject.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClassModule } from './class/class.module';
import { GradeModule } from './grade/grade.module';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { initDB } from './ormconfig';

@Module({
    imports: [
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
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>
                configService.get('database'),
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [initDB] }),
        UserModule,
        AuthModule,
        InstitutionModule,
        ClassModule,
        SubjectModule,
        ScheduleModule,
        MessageModule,
        StudentDossierModule,
        GradeModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
