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

@Injectable()
export class StudentsService {
    constructor(
        private readonly classesService: ClassesService,

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
        studentData: UpdateStudentInput,
    ): Promise<UpdateStudentPayload> {
        const { id, ...data } = studentData;
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
    }

    findAll(): Promise<Student[]> {
        return this.studentsRepository.find();
    }

    async findOne(uuid: string): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { id: uuid },
            relations: ['class', 'user'],
        });
        console.log(student.class);
        if (!student) {
            throw new NotFoundException(uuid);
        }
        return student;
    }

    async findOneByAlias(registerToken: string): Promise<Student> {
        let student = null;
        student = await this.studentsRepository.findOne({
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
