import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { StudentGrade } from './grade.model';
import { StudentsModule } from 'src/students/students.module';
import { GradeResolver } from './grade.resolver';
import { GradeService } from './grade.service';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { UsersModule } from 'src/users/users.module';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentGrade]),
        forwardRef(() => StudentsModule),
        SubjectsModule,
        UsersModule,
        ClassesModule,
    ],
    providers: [GradeResolver, GradeService, DateScalar],
    exports: [GradeService],
})
export class GradeModule {}
