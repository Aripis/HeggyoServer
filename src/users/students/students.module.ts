import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.model';
import { StudentsService } from './students.service';
import { ClassesModule } from 'src/institution/classes/classes.module';
import { UsersModule } from '../users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Student]), ClassesModule, UsersModule],
    providers: [],
    exports: [StudentsService],
})
export class StudentssModule {}
