import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersModule } from 'src/teachers/teachers.module';
import { UsersModule } from 'src/users/users.module';
import { Subject } from './subject.model';
import { SubjectsResolver } from './subjects.resolver';
import { SubjectService } from './subjects.service';

@Module({
    imports: [TypeOrmModule.forFeature([Subject]), TeachersModule, UsersModule],
    providers: [SubjectsResolver, SubjectService],
    exports: [SubjectService],
})
export class SubjectsModule {}
