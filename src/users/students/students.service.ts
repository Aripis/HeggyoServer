import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassesService } from 'src/institution/classes/classes.service';
import { StudentInput } from './student.input';
import { Student } from './student.model';
import { User } from '../user.model';

@Injectable()
export class StudentsService {
    constructor(
        private readonly classesService: ClassesService,

        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    async create(
        studentInput: StudentInput,
        user: User,
        classToken?: string,
    ): Promise<Student> {
        const student = new Student();
        Object.assign(student, studentInput);
        if (user) {
            student.user = user;
        }
        if (classToken) {
            student.class = await this.classesService.findOneByToken(
                classToken,
            );
        }

        try {
            return this.studentsRepository.save(student);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This student already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    update(student: Student) {
        return this.studentsRepository.save(student);
    }

    findAll(): Promise<Student[]> {
        return this.studentsRepository.find();
    }

    async findOne(uuid: string): Promise<Student> {
        let student = null;
        student = await this.studentsRepository.findOne(uuid);
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
