import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teacher } from './teacher.model';
import { User } from '../users/user.model';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';

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

    async update(
        updateTeacherInput: UpdateTeacherInput,
    ): Promise<UpdateTeacherPayload> {
        const { id, ...data } = updateTeacherInput;
        await this.teachersRepository.update(id, data);
        return new UpdateTeacherPayload(id);
    }

    findAll(): Promise<Teacher[]> {
        return this.teachersRepository.find();
    }

    async findOne(uuid: string): Promise<Teacher> {
        const teacher = await this.teachersRepository.findOne({
            where: { id: uuid },
        });
        if (!teacher) {
            throw new NotFoundException(uuid);
        }
        return teacher;
    }

    async remove(uuid: string): Promise<void> {
        await this.teachersRepository.delete(uuid);
    }
}
