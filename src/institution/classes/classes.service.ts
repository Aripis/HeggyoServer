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
export class InstitutionsService {
    constructor(
        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
    ) {}

    async create(classInput: ClassInput): Promise<Class> {
        const studentsClass = new Class();
        Object.assign(studentsClass, classInput);
        studentsClass.registerToken = this.generateUniqueToken();
        try {
            const result = await this.classesRepository.save(studentsClass);
            return result;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This Class already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    update(studentsClass: Class) {
        return this.classesRepository.save(studentsClass);
    }

    findAll(): Promise<Class[]> {
        return this.classesRepository.find();
    }

    async findOne(id: number): Promise<Class> {
        let studentsClass = null;
        studentsClass = await this.classesRepository.findOne(id);
        if (!studentsClass) {
            throw new NotFoundException(id);
        }
        return studentsClass;
    }

    async findOneByToken(registerToken: string): Promise<Class> {
        let studentsClass = null;
        studentsClass = await this.classesRepository.findOne({
            where: { registerToken: registerToken },
        });
        if (!studentsClass) {
            throw new NotFoundException(registerToken);
        }
        return studentsClass;
    }

    async remove(id: number): Promise<void> {
        await this.classesRepository.delete(id);
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
