import {
    InternalServerErrorException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { FindOneStudentDossierPayload } from './student-dossier-payload/find-one-student-dossier.payload';
import { AddStudentDossierInput } from './student-dossier-input/add-student-dossier.input';
import { StudentDossierPayload } from './student-dossier-payload/student-dossier.payload';
import { StudentService } from 'src/student/student.service';
import { SubjectService } from 'src/subject/subject.service';
import { StudentDossier } from './student-dossier.model';
import { Student } from 'src/student/student.model';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { File } from 'src/file/file.model';
import { Repository } from 'typeorm';

@Injectable()
export class StudentDossierService {
    constructor(
        private readonly userService: UserService,
        private readonly studentService: StudentService,
        private readonly subjectService: SubjectService,
        private readonly fileService: FileService,

        @InjectRepository(StudentDossier)
        private readonly studentDossierRepository: Repository<StudentDossier>,
    ) {}

    async add(
        input: AddStudentDossierInput,
        currUser: User,
    ): Promise<StudentDossierPayload> {
        const newStudentDossier = new StudentDossier();

        if (input.files) {
            const inputFiles = await Promise.all(input.files);

            for (const inputFile of inputFiles) {
                const fileMeta = await this.fileService.uploadCloudFileFromStream(
                    `${input.studentId}/${inputFile.filename}`,
                    inputFile.createReadStream,
                );
                const files = newStudentDossier.files
                    ? [...newStudentDossier.files]
                    : [];
                const dossierFile = new File();

                dossierFile.filename = inputFile.filename;
                dossierFile.cloudFilename = fileMeta.name;

                files.push(dossierFile);

                newStudentDossier.files = files;
            }
        }

        if (input.message) {
            newStudentDossier.message = input.message;
        }

        if (input.studentId) {
            newStudentDossier.student = await this.studentService.findOne(
                input.studentId,
            );
        }

        if (input.subjectId) {
            newStudentDossier.subject = await this.subjectService.findOne(
                input.subjectId,
            );
        }

        newStudentDossier.fromUser = await this.userService.findOne(
            currUser.id,
        );

        try {
            return new StudentDossierPayload(
                (
                    await this.studentDossierRepository.save(newStudentDossier)
                ).id,
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Student-Dossier] This message already exists: ' +
                        error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(studentId: string): Promise<FindOneStudentDossierPayload> {
        const student = await this.studentService.findOne(studentId);
        const studentDossierFiles = student.dossier
            .map((dossier: StudentDossier) => dossier.files)
            .flat();
        const files = studentDossierFiles.map((file: File) =>
            this.fileService.getCloudFile(file),
        );

        return new FindOneStudentDossierPayload(student.dossier, files);
    }

    async findAll(currUser: User): Promise<StudentDossier[]> {
        return (await this.studentService.findAll(currUser))
            .map((student: Student) => student.dossier)
            .flat();
    }
}
