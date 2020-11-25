import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeachersService } from 'src/users/teachers/teachers.service';
import { DeleteResult, Repository } from 'typeorm';
import { InstitutionsService } from '../institutions.service';

import { ClassInput } from './class.input';
import { Class } from './class.model';
import { RemoveClassPayload } from './remove-class.payload';

@Injectable()
export class ClassesService {
    constructor(
        private readonly teacherService: TeachersService,
        private readonly institutionsService: InstitutionsService,

        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
    ) {}

    async create(classInput: ClassInput): Promise<Class> {
        const studentsClass = new Class();
        Object.assign(studentsClass, classInput);

        studentsClass.classToken = await this.generateClassToken(studentsClass);
        studentsClass.institution = await this.institutionsService.findOne(
            classInput.institution,
        );
        if (classInput.classTeacher) {
            studentsClass.classTeacher = await this.teacherService.findOne(
                classInput.classTeacher,
            );
        }
        try {
            return this.classesRepository.save(studentsClass);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This Class already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    // update(studentsClass: Class) {
    //     return this.classesRepository.save(studentsClass);
    // }

    // findAll(): Promise<Class[]> {
    //     return this.classesRepository.find();
    // }

    async findOne(uuid: string): Promise<Class> {
        const studentsClass = await this.classesRepository.findOne(uuid);
        if (!studentsClass) {
            throw new NotFoundException(uuid);
        }
        return studentsClass;
    }

    async findOneByToken(classToken: string): Promise<Class> {
        let studentsClass = null;
        studentsClass = await this.classesRepository.findOne({
            where: { classToken: classToken },
        });
        if (!studentsClass) {
            throw new NotFoundException(classToken);
        }
        return studentsClass;
    }

    async remove(uuid: string): Promise<RemoveClassPayload> {
        await this.classesRepository.delete(uuid);
        return new RemoveClassPayload(uuid);
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
