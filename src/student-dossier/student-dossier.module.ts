import { StudentDossierService } from './student-dossier.service';
import { StudentDossierResolver } from './student-dossier.resolver';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { SubjectModule } from 'src/subject/subject.module';
import { StudentModule } from 'src/student/student.module';
import { StudentDossier } from './student-dossier.model';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentDossier]),
        StudentModule,
        SubjectModule,
        UserModule,
        FileModule,
    ],
    providers: [StudentDossierResolver, StudentDossierService, DateScalar],
    exports: [StudentDossierService],
})
export class StudentDossierModule {}
