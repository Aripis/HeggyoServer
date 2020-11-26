import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { DateScalar } from '../common/scalars/date.scalar';
import { InstitutionsModule } from 'src/institution/institutions.module';
import { AuthModule } from '../auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from 'src/institution/classes/classes.module';
import { StudentsModule } from './students/students.module';
import { ParentsModule } from './parents/parents.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        InstitutionsModule,
        TeachersModule,
        ClassesModule,
        StudentsModule,
        ParentsModule,
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersResolver, UsersService, DateScalar],
    exports: [UsersService],
})
export class UsersModule {}
