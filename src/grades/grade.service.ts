import { Repository } from 'typeorm';
import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentGrade } from './grade.model';
import { Student } from 'src/students/student.model';
import { AddGradeInput } from './grade-input/add-grade.input';
import { GradePayload } from './grade-payload/grade.payload';
import { SubjectService } from 'src/subjects/subjects.service';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class GradeService {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly studentService: StudentsService,

        @InjectRepository(StudentGrade)
        private readonly gradeRepository: Repository<StudentGrade>,
    ) {}

    async create(input: AddGradeInput): Promise<GradePayload> {
        const grade = new StudentGrade();
        const { subjectUUID, studentId, ...data } = input;
        Object.assign(grade, data);

        if (subjectUUID) {
            grade.subject = await this.subjectService.findOne(subjectUUID);
        }

        if (studentId) {
            grade.student = await this.studentService.findOne(studentId);
        }

        try {
            const inst = await this.gradeRepository.save(grade);
            return new GradePayload(inst.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This institution already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    // async update(
    //     updateInstitutionInput: UpdateInstitutionInput,
    // ): Promise<UpdateInstitutionPayload> {
    //     const { id, ...rest } = updateInstitutionInput;
    //     if (await this.gradeRepository.findOne(id)) {
    //         this.gradeRepository.update(id, rest);
    //         return new UpdateInstitutionPayload(id);
    //     } else {
    //         throw new NotFoundException(
    //             '[Update-Institution] Institution Not Found.',
    //         );
    //     }
    // }

    // findAll(user: User): Promise<StudentGrade[]> {
    //     return this.gradeRepository.find();
    // }

    async findAllForStudent(student: Student): Promise<StudentGrade[]> {
        const grades = await this.gradeRepository.find({
            where: { student: student },
        });
        if (!grades) {
            throw new NotFoundException(student.id);
        }
        return grades;
    }

    // async remove(currUser: User): Promise<RemoveInstitutionPayload> {
    //     const instId = (await this.userService.findOne(currUser.id)).institution
    //         .id;
    //     await this.gradeRepository.delete(instId);
    //     return new RemoveInstitutionPayload(true);
    // }
}
