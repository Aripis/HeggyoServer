import { TeacherModule } from 'src/teacher/teacher.module';
import { StudentModule } from 'src/student/student.module';
import { ParentModule } from 'src/parent/parent.module';
import { SubjectResolver } from './subject.resolver';
import { ClassModule } from 'src/class/class.module';
import { SubjectService } from './subject.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.model';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subject]),
        TeacherModule,
        StudentModule,
        ParentModule,
        ClassModule,
        UserModule,
    ],
    providers: [SubjectResolver, SubjectService],
    exports: [SubjectService],
})
export class SubjectModule {}
