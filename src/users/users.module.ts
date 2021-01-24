import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { DateScalar } from '../common/scalars/date.scalar';
import { InstitutionsModule } from 'src/institution/institutions.module';
import { AuthModule } from '../auth/auth.module';
import { TeachersModule } from '../teachers/teachers.module';
import { ClassesModule } from 'src/classes/classes.module';
import { StudentsModule } from '../students/students.module';
import { ParentsModule } from '../parents/parents.module';
import { UploadScalar } from 'src/common/scalars/upload.scalar';

@Module({
    imports: [
        AuthModule,
        InstitutionsModule,
        TeachersModule,
        ClassesModule,
        StudentsModule,
        ParentsModule,
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersResolver, UsersService, DateScalar, UploadScalar],
    exports: [UsersService],
})
export class UsersModule {}
