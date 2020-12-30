import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/teachers/teacher.model';
import { TeachersService } from 'src/teachers/teachers.service';
import { Repository } from 'typeorm';
import { TokenStatus } from './class.model';

import { CreateClassInput } from './class-input/create-class.input';
import { Class } from './class.model';
import { RemoveClassPayload } from './class-payload/remove-class.payload';
import { UpdateClassPayload } from './class-payload/update-class.payload';
import { UpdateClassInput } from './class-input/update-class.input';
import { CreateClassPayload } from './class-payload/create-class.payload';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';

@Injectable()
export class ClassesService {
    constructor(
        @Inject(forwardRef(() => TeachersService))
        private readonly teacherService: TeachersService,
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,

        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
    ) {}

    async create(
        createClassInput: CreateClassInput,
        currUser: User,
    ): Promise<CreateClassPayload> {
        const studentsClass = new Class();
        Object.assign(studentsClass, createClassInput);

        studentsClass.classToken = await this.generateClassToken(studentsClass);
        studentsClass.classTokenStatus = TokenStatus.ACTIVE;
        studentsClass.institution = (
            await this.userService.findOne(currUser.id)
        ).institution;
        if (createClassInput.teacherUUID) {
            studentsClass.teacher = await this.teacherService.findOne(
                createClassInput.teacherUUID,
            );
        }
        try {
            const cls = await this.classesRepository.save(studentsClass);
            return new CreateClassPayload(cls.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This Class already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        updateClassInput: UpdateClassInput,
    ): Promise<UpdateClassPayload> {
        const { id, ...data } = updateClassInput;
        if (await this.classesRepository.findOne(id)) {
            const { teacherUUID, ...info } = data;
            if (teacherUUID) {
                await this.classesRepository.update(id, {
                    ...info,
                    teacher: await this.teacherService.findOne(teacherUUID),
                });
            } else {
                await this.classesRepository.update(id, {
                    ...info,
                    teacher: null,
                });
            }
            return new UpdateClassPayload(updateClassInput.id);
        } else {
            throw new NotFoundException('[Update-Class]: Class not found.');
        }
    }

    async findAll(currUser: User): Promise<Class[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution;
        return this.classesRepository.find({
            where: { institution: institution },
        });
    }

    async findOne(uuid: string): Promise<Class> {
        let studentsClass = await this.classesRepository.findOne({
            where: { id: uuid },
        });
        if (!studentsClass) {
            studentsClass = await this.classesRepository.findOne({
                where: {
                    classToken: uuid,
                },
            });
            if (!studentsClass) {
                throw new NotFoundException(uuid);
            }
        }
        return studentsClass;
    }

    async remove(uuid: string): Promise<RemoveClassPayload> {
        await this.classesRepository.delete(uuid);
        return new RemoveClassPayload(uuid);
    }

    async assignTeacherToClass(
        teacher: Teacher,
        classToken: string,
    ): Promise<Class> {
        const stClass = await this.classesRepository.findOne({
            where: { classToken: classToken },
        });
        stClass.teacher = teacher;
        const { id, ...restProps } = stClass;
        await this.classesRepository.update(id, restProps);
        return stClass;
    }

    private generateClassToken(studentsClass: Class): string {
        return (
            studentsClass.classNumber.toString() +
            '-' +
            studentsClass.classLetter +
            '-' +
            Math.random()
                .toString(36)
                .substr(2, 2)
        );
    }
}
