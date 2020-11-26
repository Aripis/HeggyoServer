import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './create-user.input';
import { User, UserRoles } from './user.model';
import { InstitutionsService } from 'src/institution/institutions.service';
import { ClassesService } from 'src/institution/classes/classes.service';
import { TeachersService } from './teachers/teachers.service';
import { StudentsService } from './students/students.service';
import { ParentsService } from './parents/parents.service';

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

    async create(createUserInput: CreateUserInput): Promise<User> {
        const user = new User();
        let [instAlias, userSpecific] = [null, null];
        let resultUser = null;
        Object.assign(user, createUserInput);

        if (user && user.registerToken) {
            [instAlias, userSpecific] = user.registerToken.split('#');
            user.institution = await this.institutionsService.findOneByAlias(
                instAlias,
            );
        }

        // TODO: if additionalProps === null : error
        const [role, additionalProps] = userSpecific.split('@');
        try {
            user.password = await bcrypt.hash(user.password, 10);
            switch (role) {
                case 'a': {
                    //admin
                    user.userRole = UserRoles.ADMIN;
                    resultUser = this.usersRepository.save(user);

                    break;
                }
                case 't': {
                    //teacher
                    user.userRole = UserRoles.TEACHER;
                    resultUser = await this.usersRepository.save(user);

                    const teacher = await this.teacherService.create(
                        resultUser,
                    );

                    // additionalProps can be '***' or classId
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
                    // TODO: parent_cild assignment
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
        return resultUser;
    }

    update(user: User): Promise<User> {
        // TODO: Fix update
        return this.usersRepository.save(user);
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

    async remove(uuid: string): Promise<void> {
        await this.usersRepository.delete(uuid);
    }
}
