import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { StudentDossierService } from './student-dossier.service';
import { StudentDossierResolver } from './student-dossier.resolver';
import { StudentsModule } from 'src/students/students.module';
import { StudentDossier } from './student_dossier.model';
import { FileModule } from 'src/file/file.module';
import { BufferScalar } from 'src/common/scalars/buffer.scalar';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentDossier]),
        UsersModule,
        StudentsModule,
        SubjectsModule,
        FileModule,
    ],
    providers: [StudentDossierResolver, StudentDossierService, BufferScalar],
    exports: [StudentDossierService],
})
export class StudentDossierModule {}
