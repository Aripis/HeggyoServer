import { TeacherModule } from 'src/teacher/teacher.module';
import { StudentResolver } from './student.resolver';
import { ClassModule } from 'src/class/class.module';
import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student]),
        forwardRef(() => TeacherModule),
        forwardRef(() => ClassModule),
        forwardRef(() => UserModule),
        FileModule,
    ],
    providers: [StudentResolver, StudentService],
    exports: [StudentService],
})
export class StudentModule {}
