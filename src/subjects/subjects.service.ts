import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.model';
import { UpdateSubjectInput } from './subject-input/update-subject.input';
import { CreateSubjectInput } from './subject-input/create-subject.input';
import { UpdateSubjectPayload } from './subject-payload/update-subject.payload';
import { CreateSubjectPayload } from './subject-payload/create-subject.payload';
import { TeachersService } from 'src/teachers/teachers.service';
import { UsersService } from 'src/users/users.service';
import { ClassesService } from 'src/classes/classes.service';
import { User, UserRoles } from 'src/users/user.model';
import { Class } from 'src/classes/class.model';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class SubjectService {
    constructor(
        private readonly teachersService: TeachersService,
        private readonly userService: UsersService,
        private readonly classesService: ClassesService,
        private readonly studentsService: StudentsService,
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) {}

    async create(
        createSubjectInput: CreateSubjectInput,
        userUUID: string,
    ): Promise<CreateSubjectPayload> {
        const subject = new Subject();
        Object.assign(subject, createSubjectInput);
        subject.institution = (
            await this.userService.findOne(userUUID)
        ).institution;
        if (createSubjectInput.classUUID) {
            subject.class = await this.classesService.findOne(
                createSubjectInput.classUUID,
            );
        }
        if (createSubjectInput.teachersUUIDs) {
            const tchrs = [];
            for (const uuid of createSubjectInput.teachersUUIDs) {
                tchrs.push(await this.teachersService.findOne(uuid));
            }
            subject.teachers = tchrs;
        }

        try {
            const subj = await this.subjectRepository.save(subject);
            return new CreateSubjectPayload(subj.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    'This subject already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        updateSubjectInput: UpdateSubjectInput,
    ): Promise<UpdateSubjectPayload> {
        const { id, ...data } = updateSubjectInput;
        if (await this.subjectRepository.findOne(id)) {
            let subjectClass: Class;
            const subject = await this.subjectRepository.findOne(id);
            const { classUUID, teachersUUIDs, ...info } = data;
            if (classUUID) {
                subjectClass = await this.classesService.findOne(classUUID);
                subject.class = subjectClass;
            }
            if (teachersUUIDs) {
                const teachers = [];
                for (const uuid of teachersUUIDs) {
                    teachers.push(await this.teachersService.findOne(uuid));
                }
                subject.teachers = teachers;
            }

            Object.assign(subject, info);
            await this.subjectRepository.save(subject);
            return new UpdateSubjectPayload(id);
        } else {
            throw new NotFoundException('[Update-Subject] Subject Not Found.');
        }
    }

    async findAll(currUser: User): Promise<Subject[]> {
        const user = await this.userService.findOne(currUser.id);
        const institution = user.institution;
        if (user.userRole == UserRoles.STUDENT) {
            const student = await this.studentsService.findOneByUserUUID(
                currUser.id,
            );

            return this.subjectRepository.find({
                where: {
                    institution: institution,
                    class: student.class,
                },
            });
        } else if (user.userRole == UserRoles.TEACHER) {
            const teacher = await this.teachersService.findOneByUserUUID(
                currUser.id,
                ['subjects'],
            );
            return teacher.subjects;
        } else if (user.userRole == UserRoles.PARENT) {
            // TODO: find all by children
            return null;
        } else {
            return this.subjectRepository.find({
                where: { institution: institution },
            });
        }
    }

    async findOne(uuid: string): Promise<Subject> {
        const subject = await this.subjectRepository.findOne({
            where: { id: uuid },
        });
        if (!subject) {
            throw new NotFoundException(uuid);
        }
        return subject;
    }

    async remove(uuid: string): Promise<void> {
        await this.subjectRepository.delete(uuid);
    }
}
