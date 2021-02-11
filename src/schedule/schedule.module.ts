import { SubjectModule } from 'src/subject/subject.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { ScheduleResolver } from './schedule.resolver';
import { ClassModule } from 'src/class/class.module';
import { ScheduleService } from './schedule.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.model';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([Schedule]),
        TeacherModule,
        SubjectModule,
        ClassModule,
        UserModule,
    ],
    providers: [ScheduleResolver, ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
