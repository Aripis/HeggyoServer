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
import { User } from 'src/users/user.model';

@Injectable()
export class SubjectService {
    constructor(
        private readonly teachersService: TeachersService,
        private readonly userService: UsersService,
        private readonly classesService: ClassesService,
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) {}

    async create(
        createSubjectData: CreateSubjectInput,
        userUUID: string,
    ): Promise<CreateSubjectPayload> {
        const subject = new Subject();
        Object.assign(subject, createSubjectData);
        subject.institution = (
            await this.userService.findOne(userUUID)
        ).institution;
        if (createSubjectData.classUUID) {
            subject.class = await this.classesService.findOne(
                createSubjectData.classUUID,
            );
        }
        if (createSubjectData.teachersUUID) {
            const tchrs = [];
            for (const uuid of createSubjectData.teachersUUID) {
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
        // TODO: add update subject class
        const { id, ...data } = updateSubjectInput;
        console.log(id);
        if (await this.subjectRepository.findOne(id)) {
            if (data.teacherUUIDs) {
                const teachers = [];
                const { teacherUUIDs, ...info } = data;
                for (const uuid of teacherUUIDs) {
                    teachers.push(await this.teachersService.findOne(uuid));
                }
                this.subjectRepository.update(id, {
                    ...info,
                    teachers: teachers,
                });
            } else {
                this.subjectRepository.update(id, data);
            }
            return new UpdateSubjectPayload(id);
        } else {
            throw new NotFoundException('[Update-Subject] Subject Not Found.');
        }
    }

    async findAll(currUser: User): Promise<Subject[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution;
        return this.subjectRepository.find({
            where: { institution: institution },
        });
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
