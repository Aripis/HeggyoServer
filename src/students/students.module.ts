import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.model';
import { StudentsService } from './students.service';
import { ClassesModule } from 'src/classes/classes.module';
import { StudentsResolver } from './students.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Student]), ClassesModule],
    providers: [StudentsResolver, StudentsService],
    exports: [StudentsService],
})
export class StudentsModule {}
