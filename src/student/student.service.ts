import {
    InternalServerErrorException,
    ConflictException,
    NotFoundException,
    Injectable,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { GetStudentTokenPayload } from './student-payload/get-student-token.payload';
import { UpdateStudentRecordInput } from './student-input/update-student-record.input';
import { UpdateStudentInput } from './student-input/update-student.input';
import { StudentPayload } from './student-payload/student.payload';
import { TeacherService } from 'src/teacher/teacher.service';
import { ClassService } from 'src/class/class.service';
import { User, UserRole } from '../user/user.model';
import { UserService } from 'src/user/user.service';
import { Teacher } from 'src/teacher/teacher.model';
import { FileService } from 'src/file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.model';
import { Repository } from 'typeorm';
import { Subject } from 'src/subject/subject.model';

@Injectable()
export class StudentService {
    constructor(
        @Inject(forwardRef(() => ClassService))
        private readonly classService: ClassService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly fileService: FileService,
        private readonly teacherService: TeacherService,

        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}

    async add(user: User, classToken?: string): Promise<Student> {
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
            student.token = classToken;
            student.class = await this.classService.findOneByToken(classToken);

            if (!student.class) {
                throw new NotFoundException('[Add-Student] Class not found');
            }

            const classNumber = student.class.number;
            const classLetter = student.class.letter;

            student.token =
                lastEmailChar +
                twoRandoms +
                classNumber +
                classLetter +
                firstThree;
        }
        try {
            return this.studentRepository.save(student);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    'This student already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateStudentInput): Promise<StudentPayload> {
        const { id, ...data } = input;
        try {
            if (data.classId) {
                const { classId, ...info } = data;
                await this.studentRepository.update(id, {
                    ...info,
                    class: await this.classService.findOne(classId),
                });
            } else {
                await this.studentRepository.update(id, data);
            }

            return new StudentPayload(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async updateRecord(
        input: UpdateStudentRecordInput,
    ): Promise<StudentPayload> {
        const student = await this.studentRepository.findOne(input.id);

        if (!student) {
            throw new NotFoundException(
                '[UpdateRecord-Student]: No student Found',
            );
        }

        if (input.recordMessage) {
            student.recordMessage = input.recordMessage;
        }

        if (input.files) {
            // TODO: implement files
        }

        this.studentRepository.save(student);
        return new StudentPayload(student.id);
    }

    async findAll(currUser: User): Promise<Student[]> {
        const user = await this.userService.findOne(currUser.id);
        const students = await this.studentRepository.find();

        if (user.role === UserRole.ADMIN) {
            return students.filter(
                student => student.user.institution.id === user.institution.id,
            );
        }
        const usersIds = (await this.userService.findAll(currUser)).map(
            (user: User) => user?.id,
        );

        return students.filter(student => usersIds.includes(student?.user?.id));
    }

    async findAllForEachClass(
        currUser: User,
        classesIds: string[],
    ): Promise<Student[]> {
        const usersIds = (await this.userService.findAll(currUser)).map(
            (user: User) => user?.id,
        );
        const students = await this.studentRepository.find();

        return students.filter(
            student =>
                usersIds.includes(student?.user?.id) &&
                classesIds.includes(student.class.id),
        );
    }

    async getToken(currUser: User): Promise<GetStudentTokenPayload> {
        const token = (
            await this.studentRepository.findOne({
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

    async findOneByUserId(id: string): Promise<Student> {
        const student = (await this.studentRepository.find()).find(
            student => student.user.id === id,
        );

        if (!student) {
            throw new NotFoundException(id);
        }

        return student;
    }

    async findOne(id: string): Promise<Student> {
        const student = await this.studentRepository.findOne(id);

        if (!student) {
            throw new NotFoundException(id);
        }

        student.dossier = student.dossier.map(dossier => {
            dossier.files = dossier.files.map(file =>
                this.fileService.getCloudFile(file),
            );
            return dossier;
        });

        return student;
    }

    async findOneByAlias(registerToken: string): Promise<Student> {
        const student = await this.studentRepository.findOne({
            where: { registerToken: registerToken },
        });

        if (!student) {
            throw new NotFoundException(registerToken);
        }

        return student;
    }

    async remove(id: string): Promise<StudentPayload> {
        await this.studentRepository.delete(id);
        return new StudentPayload(id);
    }

    async verifyTeacherToStudent(
        student: Student,
        teacher: Teacher,
    ): Promise<boolean> {
        const cls = await this.classService.findOne(student.class.id);
        teacher = await this.teacherService.findOneByUserId(teacher.user.id);

        return teacher.subjects
            .map((subject: Subject) => subject.id)
            .some((id: string) =>
                cls.subjects?.map(subject => subject.id).includes(id),
            );
    }
}
