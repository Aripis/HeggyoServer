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

@Injectable()
export class StudentDossierService {
    constructor(
        private readonly userService: UsersService,
        private readonly studentService: StudentsService,

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

        // TODO: dossier Files

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
        const dossiers = await this.dossierRepository.find();

        const students = await this.studentService.findAll(currUser);

        return dossiers;
        // console.log(
        //     students.map(student => student.id === dossiers[0].student.id),
        // );
        // return students.forEach(student =>
        //     dossiers.filter(dossier => student.id === dossier.student.id),
        // );
    }
}
