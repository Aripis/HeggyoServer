import {
    InternalServerErrorException,
    ConflictException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { UpdateSubjectInput } from './subject-input/update-subject.input';
import { AddSubjectInput } from './subject-input/add-subject.input';
import { SubjectPayload } from './subject-payload/subject.payload';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentService } from 'src/student/student.service';
import { ParentService } from 'src/parent/parent.service';
import { ClassService } from 'src/class/class.service';
import { User, UserRole } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/class/class.model';
import { Subject } from './subject.model';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly studentService: StudentService,
        private readonly parentService: ParentService,

        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) {}

    async add(input: AddSubjectInput, currUser: User): Promise<SubjectPayload> {
        const newSubject = new Subject();

        Object.assign(newSubject, input);
        newSubject.institution = (
            await this.userService.findOne(currUser.id)
        ).institution;

        if (input.classId) {
            newSubject.class = await this.classService.findOne(input.classId);
        }
        if (input.teachersIds) {
            const tchrs = [];

            for (const id of input.teachersIds) {
                tchrs.push(await this.teacherService.findOne(id));
            }

            newSubject.teachers = tchrs;
        }

        try {
            return new SubjectPayload(
                (await this.subjectRepository.save(newSubject)).id,
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Subject] This subject already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateSubjectInput): Promise<SubjectPayload> {
        const { id, ...data } = input;

        try {
            let subjectClass: Class;
            const subject = await this.subjectRepository.findOne(id);
            const { classId, teachersIds, ...info } = data;

            if (classId) {
                subjectClass = await this.classService.findOne(classId);
                subject.class = subjectClass;
            }

            if (teachersIds) {
                const teachers = [];
                for (const id of teachersIds) {
                    teachers.push(await this.teacherService.findOne(id));
                }
                subject.teachers = teachers;
            }

            Object.assign(subject, info);
            await this.subjectRepository.save(subject);

            return new SubjectPayload(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(currUser: User): Promise<Subject[]> {
        const user = await this.userService.findOne(currUser.id);
        const institution = user.institution;

        if (user.role === UserRole.STUDENT) {
            const student = await this.studentService.findOneByUserId(
                currUser.id,
            );

            return this.subjectRepository.find({
                where: {
                    institution: institution,
                    class: student.class,
                },
            });
        } else if (user.role === UserRole.TEACHER) {
            const teacher = await this.teacherService.findOneByUserId(
                currUser.id,
            );
            let subjects = await this.subjectRepository.find({
                where: {
                    institution: teacher.user.institution,
                },
            });

            subjects = subjects.filter(
                subject => subject.teachers && subject.teachers.length > 0,
            );

            return subjects.filter(subject => {
                const teacherIds = subject.teachers.map(teacher => teacher.id);
                return teacherIds.includes(teacher.id);
            });
        } else if (user.role === UserRole.PARENT) {
            const parents = await this.parentService.findOneByUserId(
                currUser.id,
            );
            const subjects = [];
            const classes = parents.students.map(student => student.class);

            for (const cls of classes) {
                subjects.push(
                    await this.subjectRepository.find({
                        where: {
                            class: cls,
                        },
                    }),
                );
            }

            return subjects.flat();
        } else {
            return this.subjectRepository.find({
                where: { institution: institution },
            });
        }
    }

    async findOne(id: string): Promise<Subject> {
        const subject = await this.subjectRepository.findOne({
            where: { id: id },
        });

        if (!subject) {
            throw new NotFoundException(id);
        }

        return subject;
    }

    async remove(id: string): Promise<SubjectPayload> {
        await this.subjectRepository.delete(id);
        return new SubjectPayload(id);
    }
}
