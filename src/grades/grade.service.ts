import { Repository } from 'typeorm';
import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentGrade } from './grade.model';
import { Student } from 'src/students/student.model';
import { AddGradeInput } from './grade-input/add-grade.input';
import { GradePayload } from './grade-payload/grade.payload';
import { SubjectService } from 'src/subjects/subjects.service';
import { StudentsService } from 'src/students/students.service';
import { User, UserRoles } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { UpdateGradeInput } from './grade-input/update-grade.input';
import { ClassesService } from 'src/classes/classes.service';
import { Subject } from 'src/subjects/subject.model';
import { TeachersService } from 'src/teachers/teachers.service';

@Injectable()
export class GradeService {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly userService: UsersService,
        private readonly classesService: ClassesService,
        private readonly studentService: StudentsService,
        private readonly teacherService: TeachersService,

        @InjectRepository(StudentGrade)
        private readonly gradeRepository: Repository<StudentGrade>,
    ) {}

    async create(input: AddGradeInput, currUser: User): Promise<GradePayload> {
        const grade = new StudentGrade();
        const { subjectUUID, studentId, ...data } = input;
        Object.assign(grade, data);

        if (subjectUUID) {
            grade.subject = await this.subjectService.findOne(subjectUUID);
        }

        grade.fromUser = await this.userService.findOne(currUser.id);

        if (studentId) {
            grade.student = await this.studentService.findOne(studentId);
            const teacher = await this.teacherService.findOneByUserUUID(
                grade.fromUser.id,
            );

            if (
                !this.studentService.verifyTeacherToStudent(
                    grade.student,
                    teacher,
                ) &&
                grade.fromUser.userRole !== UserRoles.ADMIN &&
                grade.fromUser.userRole !== UserRoles.TEACHER
            ) {
                throw new UnauthorizedException(
                    '[Add-Grade] Teacher can not grade this student',
                );
            }
        }

        if (grade.fromUser.userRole != UserRoles.TEACHER) {
            throw new UnauthorizedException('[Create-Grade] Invalid user role');
        }
        try {
            const inst = await this.gradeRepository.save(grade);
            return new GradePayload(inst.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This grade already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        input: UpdateGradeInput,
        currUser: User,
    ): Promise<GradePayload> {
        const { gradeUUID, studentId, subjectUUID, ...rest } = input;
        const grade = await this.gradeRepository.findOne(gradeUUID);
        if (grade) {
            Object.assign(grade, rest);
            grade.student = await this.studentService.findOne(studentId);
            grade.fromUser = await this.userService.findOne(currUser.id);
            grade.subject = await this.subjectService.findOne(subjectUUID);
            await this.gradeRepository.save(grade);
            return new GradePayload(gradeUUID);
        } else {
            throw new NotFoundException('[Update-Grade] Grade Not Found.');
        }
    }

    async findAllByClass(
        classUUID: string,
        currUser: User,
    ): Promise<StudentGrade[]> {
        currUser = await this.userService.findOne(currUser.id);
        const cls = await this.classesService.findOne(classUUID);
        if (
            currUser.institution.id === cls.institution.id &&
            (currUser.userRole == UserRoles.ADMIN ||
                currUser.userRole == UserRoles.TEACHER)
        ) {
            const grades = await this.gradeRepository.find({
                relations: ['student'],
            });
            return grades.filter(grade => grade.student.class.id == cls.id);
        } else {
            throw new UnauthorizedException(
                '[Grades-By-Class] Permission Denied',
            );
        }
    }

    async findAllForOneStudent(
        studentUUID: string,
        currUser: User,
    ): Promise<StudentGrade[]> {
        const student = await this.studentService.findOne(studentUUID);
        const grades = await this.gradeRepository.find({
            where: { student: student },
        });
        if (!grades) {
            throw new NotFoundException(student.id);
        }
        return grades;
    }

    async findAllForOneSubject(
        subjectId: string,
        classId: string,
    ): Promise<StudentGrade[]> {
        const subject = await this.subjectService.findOne(subjectId);
        // const cls = await this.classesService.findOne(classId);
        const grades = await this.gradeRepository.find({
            where: {
                subject: subject,
            },
        });
        if (!grades) {
            throw new NotFoundException(subject.id);
        }
        return grades.filter(grade => grade.subject.id === subject.id);
    }

    async remove(gradeUUID: string): Promise<GradePayload> {
        await this.gradeRepository.delete(gradeUUID);
        return new GradePayload(gradeUUID);
    }
}
