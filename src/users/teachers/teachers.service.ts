import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teacher } from './teacher.model';
import { User } from '../user.model';
import { TeacherInput } from './teacher.input';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teachersRepository: Repository<Teacher>,
    ) {}

    create(user: User): Promise<Teacher> {
        const teacher = new Teacher();
        if (user) {
            teacher.user = user;
        }
        try {
            return this.teachersRepository.save(teacher);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This teacher already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(teacher: TeacherInput) {
        // TODO: Fix update
        const newTeacher = await this.teachersRepository.findOne({});
        Object.assign(newTeacher, teacher);
        return this.teachersRepository.save(newTeacher);
    }

    findAll(): Promise<Teacher[]> {
        return this.teachersRepository.find();
    }

    async findOne(uuid: string): Promise<Teacher> {
        let teacher = null;
        teacher = await this.teachersRepository.findOne(uuid);
        if (!teacher) {
            throw new NotFoundException(uuid);
        }
        return teacher;
    }

    async findOneByAlias(registerToken: string): Promise<Teacher> {
        let teacher = null;
        teacher = await this.teachersRepository.findOne({
            where: { registerToken: registerToken },
        });
        if (!teacher) {
            throw new NotFoundException(registerToken);
        }
        return teacher;
    }

    async remove(uuid: string): Promise<void> {
        await this.teachersRepository.delete(uuid);
    }
}
