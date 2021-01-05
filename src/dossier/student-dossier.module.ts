import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { StudentDossierService } from './student-dossier.service';
import { StudentDossierResolver } from './student-dossier.resolver';
import { StudentsModule } from 'src/students/students.module';
import { StudentDossier } from './student-dossier.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentDossier]),

        UsersModule,
        StudentsModule,
        SubjectsModule,
    ],
    providers: [StudentDossierResolver, StudentDossierService, DateScalar],
    exports: [StudentDossierService],
})
export class StudentDossierModule {}
