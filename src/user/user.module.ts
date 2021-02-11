import { InstitutionModule } from 'src/institution/institution.module';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { StudentModule } from 'src/student/student.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { TeacherModule } from 'src/teacher/teacher.module';
import { ParentModule } from 'src/parent/parent.module';
import { ClassModule } from 'src/class/class.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => InstitutionModule),
        forwardRef(() => StudentModule),
        forwardRef(() => TeacherModule),
        forwardRef(() => ParentModule),
        forwardRef(() => ClassModule),
        forwardRef(() => AuthModule),
    ],
    providers: [UserResolver, UserService, DateScalar, UploadScalar],
    exports: [UserService],
})
export class UserModule {}
