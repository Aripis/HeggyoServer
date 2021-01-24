import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesModule } from 'src/classes/classes.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { UsersModule } from 'src/users/users.module';
import { Schedule } from './schedule.model';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Schedule]),
        ClassesModule,
        TeachersModule,
        SubjectsModule,
        UsersModule,
    ],
    providers: [ScheduleResolver, ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
