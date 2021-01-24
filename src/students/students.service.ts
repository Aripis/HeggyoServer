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
import { ClassesService } from 'src/classes/classes.service';
import { Student } from './student.model';
import { User } from '../users/user.model';
import { UpdateStudentInput } from './student-input/update-student.input';
import { UpdateStudentPayload } from './student-payload/update-student.payload';
import { UsersService } from 'src/users/users.service';
import { GetStudentTokenPayload } from './student-payload/get-student-token.payload';
import { UpdateStudentRecordInput } from './student-input/update-student-record.input';

@Injectable()
export class StudentsService {
    constructor(
        private readonly classesService: ClassesService,
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,

        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    async create(user: User, classToken?: string): Promise<Student> {
        const student = new Student();
        // {lastCharOfEmail}{2randomChars}{classNumber}{classLetter}{firstLetterFirstName}{firstLetterMiddleName}{firstLetterLastName}
        let lastEmailChar = '',
            twoRandoms = '',
            firstThree: string;

        if (user) {
            student.user = user;
            lastEmailChar = user.email.split('@')[0];
            lastEmailChar = lastEmailChar[lastEmailChar.length - 1];
            twoRandoms = Math.random()
                .toString(36)
                .substr(2, 2);
            firstThree =
                user.firstName[0] + user.middleName[0] + user.lastName[0];
        }
        if (classToken) {
            student.studentToken = classToken;
            student.class = await this.classesService.findOne(classToken);
            const classNumber = student.class.classNumber;
            const classLetter = student.class.classLetter;
            student.token =
                lastEmailChar +
                twoRandoms +
                classNumber +
                classLetter +
                firstThree;
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

    async updateRecord(
        updateData: UpdateStudentRecordInput,
    ): Promise<UpdateStudentPayload> {
        const student = await this.studentsRepository.findOne(updateData.uuid);
        if (!student) {
            throw new NotFoundException(
                '[UpdateRecord-Student]: No student Found',
            );
        }
        if (updateData.recordMessage) {
            student.recordMessage = updateData.recordMessage;
        }
        if (updateData.files) {
            // TODO: implement files
            // student.recordFiles = updateData.files
        }
        this.studentsRepository.save(student);
        return new UpdateStudentPayload(student.id);
    }

    async findAll(currUser: User): Promise<Student[]> {
        const users = await this.userService.findAll(currUser);
        const students = await this.studentsRepository.find();
        return students.filter(student =>
            users.map(user => student?.user?.id === user?.id),
        );
    }

    async findAllForEachClass(
        currUser: User,
        classesUUIDs: string[],
    ): Promise<Student[]> {
        const usersUUIDs = (await this.userService.findAll(currUser)).map(
            user => user?.id,
        );
        const students = await this.studentsRepository.find();
        return students.filter(
            student =>
                usersUUIDs.includes(student?.user?.id) &&
                classesUUIDs.includes(student.class.id),
        );
    }

    async getToken(currUser: User): Promise<GetStudentTokenPayload> {
        const token = (
            await this.studentsRepository.findOne({
                where: { user: await this.userService.findOne(currUser.id) },
            })
        ).token;
        if (!token) {
            throw new NotFoundException(
                '[Get-Token]: No Student Token was Found',
            );
        }
        return new GetStudentTokenPayload(token);
    }

    async findOneByUserUUID(uuid: string): Promise<Student> {
        const students = await this.studentsRepository.find();
        const student = students.find(stud => stud.user.id == uuid);
        if (!student) {
            throw new NotFoundException(uuid);
        }
        return student;
    }

    async findOne(uuid: string): Promise<Student> {
        const student = await this.studentsRepository.findOne(uuid);
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
