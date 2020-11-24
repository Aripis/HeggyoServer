import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClassInput } from './class.input';
import { Class } from './class.model';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
    ) {}

    create(classInput: ClassInput): Promise<Class> {
        const studentsClass = new Class();
        Object.assign(studentsClass, classInput);

        studentsClass.classToken = this.generateUniqueToken();

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

    async remove(uuid: string): Promise<void> {
        await this.classesRepository.delete(uuid);
    }

    private generateUniqueToken(): string {
        //FIXME: Make sure it's unique for all insatutions
        return (
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 5)
        );
    }
}
