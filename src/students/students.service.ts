import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassesService } from 'src/classes/classes.service';
import { Student } from './student.model';
import { User } from '../users/user.model';
import { UpdateStudentInput } from './student-input/update-student.input';
import { UpdateStudentPayload } from './student-payload/update-student.payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StudentsService {
    constructor(
        private readonly classesService: ClassesService,
        private readonly userService: UsersService,

        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    async create(user: User, classToken?: string): Promise<Student> {
        const student = new Student();
        if (user) {
            student.user = user;
        }
        if (classToken) {
            student.studentToken = classToken;
            student.class = await this.classesService.findOne(classToken);
        }
        try {
            const test = this.studentsRepository.save(student);
            return test;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    'This student already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        updateStudentInput: UpdateStudentInput,
    ): Promise<UpdateStudentPayload> {
        const { id, ...data } = updateStudentInput;
        if (await this.studentsRepository.findOne(id)) {
            if (data.classUUID) {
                const { classUUID, ...info } = data;
                await this.studentsRepository.update(id, {
                    ...info,
                    class: await this.classesService.findOne(classUUID),
                });
            } else {
                await this.studentsRepository.update(id, data);
            }
            return new UpdateStudentPayload(id);
        } else {
            throw new NotFoundException('[Update-Student]: Student not found.');
        }
    }

    async findAll(currUser: User): Promise<Student[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution[0];
        return this.studentsRepository.find({
            where: { institution: institution },
        });
    }

    async findOne(uuid: string): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { id: uuid },
        });
        if (!student) {
            throw new NotFoundException(uuid);
        }
        return student;
    }

    async findOneByAlias(registerToken: string): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { registerToken: registerToken },
        });
        if (!student) {
            throw new NotFoundException(registerToken);
        }
        return student;
    }

    async remove(uuid: string): Promise<void> {
        await this.studentsRepository.delete(uuid);
    }
}
