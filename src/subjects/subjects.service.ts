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

@Injectable()
export class SubjectService {
    constructor(
        private readonly teachersService: TeachersService,
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) {}

    async create(
        createSubjectData: CreateSubjectInput,
    ): Promise<CreateSubjectPayload> {
        const subject = new Subject();
        Object.assign(subject, createSubjectData);
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
            }
            this.subjectRepository.update(id, data);
            return new UpdateSubjectPayload(id);
        } else {
            throw new Error('[Update-Subject] Subject Not Found.');
        }
    }

    findAll(): Promise<Subject[]> {
        return this.subjectRepository.find();
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
