import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
	forwardRef,
	Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teacher } from './teacher.model';
import { User } from '../users/user.model';
import { UpdateTeacherPayload } from './teacher-payload/update-teacher.payload';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeachersService {
    constructor(
    	@Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,

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
        const institution = (await this.userService.findOne(currUser.id))
            .institution[0];
        return this.teachersRepository.find({
            where: { institution: institution },
        });
    }

    async findOne(uuid: string): Promise<Teacher> {
        const teacher = await this.teachersRepository.findOne(uuid);
        if (!teacher) {
            throw new NotFoundException(uuid);
        }
        return teacher;
    }

    async remove(uuid: string): Promise<void> {
        await this.teachersRepository.delete(uuid);
    }
}
