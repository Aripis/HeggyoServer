import { StudentModule } from 'src/student/student.module';
import { SubjectModule } from 'src/subject/subject.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { ClassModule } from 'src/class/class.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { GradeResolver } from './grade.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeService } from './grade.service';
import { StudentGrade } from './grade.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentGrade]),
        forwardRef(() => StudentModule),
        TeacherModule,
        SubjectModule,
        ClassModule,
        UserModule,
    ],
    providers: [GradeResolver, GradeService, DateScalar],
    exports: [GradeService],
})
export class GradeModule {}
