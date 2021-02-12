import {
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    Injectable,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { UpdateTeacherInput } from './teacher-input/update-teacher.input';
import { TeacherPayload } from './teacher-payload/teacher.payload';
import { ClassService } from 'src/class/class.service';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './teacher.model';
import { User } from '../user/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => ClassService))
        private readonly classService: ClassService,

        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
    ) {}

    add(user: User): Promise<Teacher> {
        const newTeacher = new Teacher();
        if (user) {
            newTeacher.user = user;
        }

        try {
            return this.teacherRepository.save(newTeacher);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Teacher] This teacher already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateTeacherInput): Promise<TeacherPayload> {
        const { id, ...data } = input;

        try {
            await this.teacherRepository.update(id, data);
            return new TeacherPayload(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(currUser: User): Promise<Teacher[]> {
        const usersIds = (await this.userService.findAll(currUser)).map(
            (user: User) => user.id,
        );
        const teachers = await this.teacherRepository.find();

        return teachers.filter(teacher => usersIds.includes(teacher.user.id));
    }

    async findAvailableClassTeachers(
        currUser: User,
        id?: string,
    ): Promise<Teacher[]> {
        const classTeachersIds = (await this.classService.findAll(currUser))
            .filter(currClass => currClass.teacher)
            .map(currClass => currClass.teacher.id);
        const includedClass = id ? await this.classService.findOne(id) : null;
        const usersIds = (await this.userService.findAll(currUser)).map(
            (user: User) => user.id,
        );
        const teachers = await this.teacherRepository.find();

        return teachers.filter(
            teacher =>
                usersIds.includes(teacher.user.id) &&
                (!classTeachersIds.includes(teacher.id) ||
                    includedClass?.teacher?.id === teacher.id),
        );
    }

    async findOne(id: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne(id);

        if (!teacher) {
            throw new NotFoundException(id);
        }
        return teacher;
    }

    async findOneByUserId(id: string): Promise<Teacher> {
        const teachers = await this.teacherRepository.find({
            join: {
                alias: 'subject',
                leftJoinAndSelect: {
                    subjects: 'subject.subjects',
                },
            },
        });
        const teacher = teachers.find(teacher => teacher.user.id == id);

        if (!teacher) {
            throw new NotFoundException(id);
        }

        return teacher;
    }

    async remove(id: string): Promise<TeacherPayload> {
        await this.teacherRepository.delete(id);
        return new TeacherPayload(id);
    }
}
