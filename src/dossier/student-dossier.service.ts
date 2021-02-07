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
import { Repository } from 'typeorm';
import { CreateStudentDossierInput } from './dossier-input/create-student-dossier.input';
import { CreateStudentDossierPayload } from './dossier-payload/create-student-dossier.payload';
import { StudentDossier } from './student_dossier.model';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { File } from 'src/file/file.model';

@Injectable()
export class StudentDossierService {
    constructor(
        private readonly userService: UsersService,
        private readonly studentService: StudentsService,
        private readonly configService: ConfigService,
        private readonly subjectService: SubjectService,
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
        const credentials = JSON.parse(
            this.configService.get<string>('SERVICE_ACCOUNT_CREDENTIALS'),
        );
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

        const storage = new Storage({
            credentials,
        });

        const bucket = storage.bucket(
            this.configService.get<string>('GCS_BUCKET_NAME'),
        );
        // TODO: dossier Files
        if (input.files) {
            const inputFiles = await Promise.all(input.files);
            for (const inputFile of inputFiles) {
                const file = bucket.file(
                    `${input.studentId}/${(inputFile as any).filename}`,
                );
                (inputFile as any)
                    .createReadStream()
                    .pipe(file.createWriteStream());
                const files = dossier.studentFiles
                    ? [...dossier.studentFiles]
                    : [];
                const dossierFile = new File();
                dossierFile.filePath = `${input.studentId}/${
                    (inputFile as any).filename
                }`;
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

    async findAll(currUser: User): Promise<StudentDossier[]> {
        return (await this.studentService.findAll(currUser))
            .map(student => student.dossier)
            .flat();
    }
}
