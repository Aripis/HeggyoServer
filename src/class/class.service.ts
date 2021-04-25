import {
    InternalServerErrorException,
    ConflictException,
    NotFoundException,
    Injectable,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { AddClassInput } from './class-input/add-class.input';
import { UpdateClassInput } from './class-input/update-class.input';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentService } from 'src/student/student.service';
import { ClassPayload } from './class-payload/class.payload';
import { User, UserRole } from 'src/user/user.model';
import { Subject } from 'src/subject/subject.model';
import { UserService } from 'src/user/user.service';
import { Teacher } from 'src/teacher/teacher.model';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenStatus } from './class.model';
import { Class } from './class.model';
import { Repository } from 'typeorm';

@Injectable()
export class ClassService {
    constructor(
        @Inject(forwardRef(() => StudentService))
        private readonly studentService: StudentService,
        @Inject(forwardRef(() => TeacherService))
        private readonly teacherService: TeacherService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
    ) {}

    async add(input: AddClassInput, currUser: User): Promise<ClassPayload> {
        const newClass = new Class();
        Object.assign(newClass, input);

        newClass.token = this.generateClassToken(newClass);
        newClass.tokenStatus = TokenStatus.ACTIVE;
        newClass.institution = (
            await this.userService.findOne(currUser.id)
        ).institution;

        if (input.teacherId) {
            newClass.teacher = await this.teacherService.findOne(
                input.teacherId,
            );
        }
        try {
            return new ClassPayload(
                (await this.classRepository.save(newClass)).id,
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Class] This Class already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateClassInput): Promise<ClassPayload> {
        const { id, ...data } = input;
        const { teacherId, ...info } = data;

        try {
            if (teacherId) {
                await this.classRepository.update(id, {
                    ...info,
                    teacher: await this.teacherService.findOne(teacherId),
                });
            } else {
                await this.classRepository.update(id, {
                    ...info,
                    teacher: null,
                });
            }
            return new ClassPayload(input.id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(currUser: User): Promise<Class[]> {
        const user = await this.userService.findOne(currUser.id);

        if (user.role === UserRole.STUDENT) {
            const ccls = (await this.studentService.findOneByUserId(user.id))
                .class;
            return await this.classRepository.find({
                join: {
                    alias: 'subject',
                    leftJoinAndSelect: {
                        subjects: 'subject.subjects',
                    },
                },
                where: { id: ccls.id },
            });
        } else if (user.role === UserRole.TEACHER) {
            const teacher = await this.teacherService.findOneByUserId(user.id);
            const allClasses = await this.classRepository.find({
                join: {
                    alias: 'subject',
                    leftJoinAndSelect: {
                        subjects: 'subject.subjects',
                    },
                },
                where: {
                    institution: user.institution,
                },
            });

            const tchSubjIds = teacher.subjects.map(sbj => sbj.id);
            const teacherClasses = allClasses.map(cls => {
                if (
                    cls.subjects.filter(subject =>
                        tchSubjIds.includes(subject.id),
                    )
                ) {
                    cls.subjects = cls.subjects.filter(subject =>
                        tchSubjIds.includes(subject.id),
                    );
                    return cls;
                }
            });

            return [
                ...new Set([
                    ...allClasses.filter(
                        cls => cls?.teacher?.id === teacher.id,
                    ),
                    ...teacherClasses,
                ]),
            ];
        } else if (user.role === UserRole.ADMIN) {
            return this.classRepository.find({
                where: { institution: user.institution },
            });
        }
    }

    async findOne(id: string): Promise<Class> {
        const cls = await this.classRepository.findOne({
            where: { id: id },
        });

        if (!cls) {
            throw new NotFoundException(id);
        }

        return cls;
    }

    async findOneByToken(token: string): Promise<Class> {
        const cls = await this.classRepository.findOne({
            where: {
                token: token,
            },
        });

        if (!cls) {
            throw new NotFoundException(token);
        }

        return cls;
    }

    async remove(id: string): Promise<ClassPayload> {
        await this.classRepository.delete(id);
        return new ClassPayload(id);
    }

    async assignTeacherToClass(
        teacher: Teacher,
        token: string,
    ): Promise<Class> {
        const cls = await this.classRepository.findOne({
            where: { token: token },
        });
        cls.teacher = teacher;
        const { id, ...data } = cls;

        await this.classRepository.update(id, data);

        return cls;
    }

    private generateClassToken(cls: Class): string {
        return (
            cls.number.toString() +
            '-' +
            cls.letter +
            '-' +
            Math.random()
                .toString(36)
                .substr(2, 2)
        );
    }
}
