import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './user-input/create-user.input';
import { User, UserRoles } from './user.model';
import { InstitutionsService } from 'src/institution/institutions.service';
import { ClassesService } from 'src/classes/classes.service';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';
import { ParentsService } from '../parents/parents.service';
import { UpdateUserInput } from './user-input/update-user.input';
import { UpdateUserPayload } from './user-payload/update-user.payload';
import { RemoveUserPayload } from './user-payload/remove-user.payload';
import { CreateUserPayload } from './user-payload/create-user.payload';

@Injectable()
export class UsersService {
    constructor(
        private readonly institutionsService: InstitutionsService,
        private readonly teacherService: TeachersService,
        private readonly classesService: ClassesService,
        private readonly studentsService: StudentsService,
        private readonly parentsService: ParentsService,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserInput: CreateUserInput): Promise<CreateUserPayload> {
        const user = new User();
        let resultUser: User, instAlias: string, userSpecific: string;
        Object.assign(user, createUserInput);

        if (user && user.registerToken) {
            [instAlias, userSpecific] = user.registerToken.split('#');
            const institutions = [];
            institutions.push(
                await this.institutionsService.findOneByAlias(instAlias),
            );
            user.institution = institutions;
        }

        const [userRole, additionalProps] = userSpecific.split('@');
        if (userRole !== 'a' && additionalProps === '') {
            throw new Error('Bad register token');
        }
        try {
            user.password = await bcrypt.hash(user.password, 10);
            switch (userRole) {
                case 'a': {
                    //admin
                    user.userRole = UserRoles.ADMIN;
                    resultUser = await this.usersRepository.save(user);
                    break;
                }
                case 't': {
                    //teacher
                    user.userRole = UserRoles.TEACHER;
                    resultUser = await this.usersRepository.save(user);
                    const teacher = await this.teacherService.create(
                        resultUser,
                    );
                    if (
                        additionalProps.length === 6 ||
                        additionalProps.length === 7
                    ) {
                        this.classesService.assignTeacherToClass(
                            teacher,
                            additionalProps,
                        );
                    }
                    break;
                }
                case 's': {
                    //student
                    user.userRole = UserRoles.STUDENT;
                    resultUser = await this.usersRepository.save(user);
                    this.studentsService.create(resultUser, additionalProps);
                    break;
                }
                case 'p': {
                    //parent
                    user.userRole = UserRoles.PARENT;
                    resultUser = await this.usersRepository.save(user);
                    const students = additionalProps.split(',');
                    if (!students) {
                        throw new Error('Parent without students');
                    }
                    this.parentsService.create(resultUser, students);
                    break;
                }
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('The user already exists');
            }
            throw new InternalServerErrorException(error);
        }
        return new CreateUserPayload(resultUser.id);
    }

    async update(updateUserInput: UpdateUserInput): Promise<UpdateUserPayload> {
        const { id, ...data } = updateUserInput;
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        await this.usersRepository.update(id, data);
        return new UpdateUserPayload(id);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(uuid: string): Promise<User> {
        let user = await this.usersRepository.findOne(uuid);
        if (!user) {
            user = await this.usersRepository.findOne({
                where: { email: uuid },
            });
        }
        if (!user) {
            throw new NotFoundException(`User not found: ${uuid}`);
        }
        return user;
    }

    async remove(uuid: string): Promise<RemoveUserPayload> {
        try {
            await this.usersRepository.delete(uuid);
            return new RemoveUserPayload(true);
        } catch (error) {
            throw new Error(error);
        }
    }
}
