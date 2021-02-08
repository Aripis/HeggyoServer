/* eslint-disable @typescript-eslint/camelcase */
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentsService } from 'src/students/students.service';
import { SubjectService } from 'src/subjects/subjects.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreateStudentDossierInput } from './dossier-input/create-student-dossier.input';
import { CreateStudentDossierPayload } from './dossier-payload/create-student-dossier.payload';
import { StudentDossier } from './student_dossier.model';
import { File } from 'src/file/file.model';
import { FindOneStudentDossierInput } from './dossier-input/find-one-student-dossier.input';
import { FindOneStudentDossierPayload } from './dossier-payload/find-one-student-dossier.payload';

@Injectable()
export class StudentDossierService {
    constructor(
        private readonly userService: UsersService,
        private readonly studentService: StudentsService,
        private readonly subjectService: SubjectService,
        private readonly fileService: FileService,
        @InjectRepository(StudentDossier)
        private readonly dossierRepository: Repository<StudentDossier>,
    ) {}

    async create(
        input: CreateStudentDossierInput,
        currUser: User,
    ): Promise<CreateStudentDossierPayload> {
        const dossier = new StudentDossier();

        if (input.dossierMessage) {
            dossier.dossierMessage = input.dossierMessage;
        }

        if (input.studentId) {
            dossier.student = await this.studentService.findOne(
                input.studentId,
            );
        }

        if (input.subjectUUID) {
            dossier.subject = await this.subjectService.findOne(
                input.subjectUUID,
            );
        }

        if (input.files) {
            const inputFiles = await Promise.all(input.files);
            for (const inputFile of inputFiles) {
                const fileMeta = await this.fileService.uploadCloudFileFromStream(
                    `${input.studentId}/${inputFile.filename}`,
                    inputFile.createReadStream,
                );
                const files = dossier.studentFiles
                    ? [...dossier.studentFiles]
                    : [];
                const dossierFile = new File();
                dossierFile.filename = inputFile.filename;
                dossierFile.cloudFilename = fileMeta.name;
                files.push(dossierFile);
                dossier.studentFiles = files;
            }
        }
        dossier.fromUser = await this.userService.findOne(currUser.id);

        try {
            const dssr = await this.dossierRepository.save(dossier);
            return new CreateStudentDossierPayload(dssr.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    'This message already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(
        input: FindOneStudentDossierInput,
        currUser: User,
    ): Promise<FindOneStudentDossierPayload> {
        const student = await this.studentService.findOne(input.studentId);
        const studentDossierFiles = student.dossier
            .map(dossier => dossier.studentFiles)
            .flat();
        const bufferArray = await Promise.all(
            studentDossierFiles.map(
                async file =>
                    await this.fileService.getCloudFile(file.cloudFilename),
            ),
        );
        return new FindOneStudentDossierPayload(student.dossier, bufferArray);
    }

    async findAll(currUser: User): Promise<StudentDossier[]> {
        return (await this.studentService.findAll(currUser))
            .map(student => student.dossier)
            .flat();
    }
}
