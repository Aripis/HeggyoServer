import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ClassResolver } from './class.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { Class } from './class.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        forwardRef(() => TeacherModule),
        forwardRef(() => StudentModule),
        forwardRef(() => UserModule),
    ],
    providers: [ClassResolver, ClassService, DateScalar],
    exports: [ClassService],
})
export class ClassModule {}
