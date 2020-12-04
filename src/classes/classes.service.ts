import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/teachers/teacher.model';
import { TeachersService } from 'src/teachers/teachers.service';
import { Repository } from 'typeorm';
import { InstitutionsService } from '../institution/institutions.service';
import { TokenStatus } from './class.model';

import { CreateClassInput } from './class-input/create-class.input';
import { Class } from './class.model';
import { RemoveClassPayload } from './class-payload/remove-class.payload';
import { UpdateClassPayload } from './class-payload/update-class.payload';
import { UpdateClassInput } from './class-input/update-class.input';
import { CreateClassPayload } from './class-payload/create-class.payload';

@Injectable()
export class ClassesService {
    constructor(
        private readonly teacherService: TeachersService,
        private readonly institutionsService: InstitutionsService,

        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
    ) {}

    async create(
        createClassInput: CreateClassInput,
    ): Promise<CreateClassPayload> {
        const studentsClass = new Class();
        Object.assign(studentsClass, createClassInput);

        studentsClass.classToken = await this.generateClassToken(studentsClass);
        studentsClass.classTokenStatus = TokenStatus.ACTIVE;
        studentsClass.institution = await this.institutionsService.findOne(
            createClassInput.institution,
        );
        if (createClassInput.classTeacher) {
            studentsClass.classTeacher = await this.teacherService.findOne(
                createClassInput.classTeacher,
            );
        }
        try {
            const cls = await this.classesRepository.save(studentsClass);
            return new CreateClassPayload(cls.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This Class already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(studentsClass: UpdateClassInput): Promise<UpdateClassPayload> {
        const { id, ...data } = studentsClass;
        if (await this.classesRepository.findOne(id)) {
            if (data.teacherUUID) {
                const { teacherUUID, ...info } = data;
                await this.classesRepository.update(id, {
                    ...info,
                    classTeacher: await this.teacherService.findOne(
                        teacherUUID,
                    ),
                });
            } else {
                await this.classesRepository.update(id, data);
            }
            return new UpdateClassPayload(studentsClass.id);
        } else {
            throw new Error('[Update-Class]: Class not found.');
        }
    }

    findAll(): Promise<Class[]> {
        return this.classesRepository.find();
    }

    async findOne(value: string): Promise<Class> {
        let studentsClass = await this.classesRepository.findOne({
            where: { id: value },
        });
        if (!studentsClass) {
            studentsClass = await this.classesRepository.findOne({
                where: {
                    classToken: value,
                },
            });
            if (!studentsClass) {
                throw new NotFoundException(value);
            }
        }
        return studentsClass;
    }

    async remove(uuid: string): Promise<RemoveClassPayload> {
        await this.classesRepository.delete(uuid);
        return new RemoveClassPayload(uuid);
    }

    async assignTeacherToClass(
        teacher: Teacher,
        classToken: string,
    ): Promise<Class> {
        const stClass = await this.classesRepository.findOne({
            where: { classToken: classToken },
        });
        stClass.classTeacher = teacher;
        const { id, ...restProps } = stClass;
        await this.classesRepository.update(id, restProps);
        return stClass;
    }

    private generateClassToken(studentsClass: Class): string {
        return (
            studentsClass.classNumber.toString() +
            '-' +
            studentsClass.classLetter +
            '-' +
            Math.random()
                .toString(36)
                .substr(2, 2)
        );
    }
}
