import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teacher } from './teacher.model';
import { User } from '../users/user.model';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { UsersService } from 'src/users/users.service';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class TeachersService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        @Inject(forwardRef(() => ClassesService))
        private readonly classesService: ClassesService,
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
        if (await this.teachersRepository.findOne(id)) {
            await this.teachersRepository.update(id, data);
            return new UpdateTeacherPayload(id);
        } else {
            throw new NotFoundException('[Update-Teacher] Teacher Not Found.');
        }
    }

    async findAll(currUser: User): Promise<Teacher[]> {
        // FIXME: Implement with query builder
        const users = await this.userService.findAll(currUser);
        const teachers = await this.teachersRepository.find();
        return teachers.filter(teacher =>
            users.map(user => teacher.user.id === user.id),
        );
    }

    async findAvailableClassTeachers(
        currUser: User,
        uuid?: string,
    ): Promise<Teacher[]> {
        const classTeachersUUIDs = (await this.classesService.findAll(currUser))
            .filter(currClass => currClass.teacher)
            .map(currClass => currClass.teacher.id);
        const includedClass = uuid
            ? await this.classesService.findOne(uuid)
            : null;
        const usersUUIDs = (await this.userService.findAll(currUser)).map(
            user => user.id,
        );
        const teachers = await this.teachersRepository.find();
        return teachers.filter(
            teacher =>
                usersUUIDs.includes(teacher.user.id) &&
                (!classTeachersUUIDs.includes(teacher.id) ||
                    includedClass?.teacher?.id === teacher.id),
        );
    }

    async findOne(uuid: string): Promise<Teacher> {
        const teacher = await this.teachersRepository.findOne(uuid);
        if (!teacher) {
            throw new NotFoundException(uuid);
        }
        return teacher;
    }

    async findOneByUserUUID(
        uuid: string,
        relations: string[],
    ): Promise<Teacher> {
        const teachers = await this.teachersRepository.find({
            where: {
                relations: relations,
            },
        });
        const teacher = teachers.find(teacher => teacher.user.id == uuid);
        if (!teacher) {
            throw new NotFoundException(uuid);
        }
        return teacher;
    }

    async remove(uuid: string): Promise<void> {
        await this.teachersRepository.delete(uuid);
    }
}
