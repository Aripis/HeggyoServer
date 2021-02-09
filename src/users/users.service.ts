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
import { GenerateUserTokenPayload } from './user-payload/generate-user-token.payload';
import { GenerateUserTokenInput } from './user-input/generate-user-token.input';
import { UpdateUserStatusInput } from './user-input/update-user-status.input';

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => InstitutionsService))
        private readonly institutionsService: InstitutionsService,
        @Inject(forwardRef(() => TeachersService))
        private readonly teacherService: TeachersService,
        @Inject(forwardRef(() => ClassesService))
        private readonly classesService: ClassesService,
        @Inject(forwardRef(() => StudentsService))
        private readonly studentsService: StudentsService,
        @Inject(forwardRef(() => ParentsService))
        private readonly parentsService: ParentsService,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(input: CreateUserInput): Promise<CreateUserPayload> {
        const user = new User();
        let resultUser: User, instAlias: string, userSpecific: string;
        if (input.photo) {
            const { photo, ...data } = input;
            Object.assign(user, data);
        } else {
            Object.assign(user, input);
        }

        if (user && user.registerToken) {
            [instAlias, userSpecific] = user.registerToken.split('#');
            user.institution = await this.institutionsService.findOneByAlias(
                instAlias,
            );
        }

        const [userRole, additionalProps] = userSpecific.split('@');
        if (userRole !== 'a' && userRole !== 't' && additionalProps === '') {
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
                case 'v': {
                    //viewer
                    //TODO: create logic for viewers
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

    async update(
        input: UpdateUserInput,
        currUser: User,
    ): Promise<UpdateUserPayload> {
        if (await this.usersRepository.findOne(currUser.id)) {
            const user = await this.usersRepository.findOne(currUser.id);
            Object.assign(user, input);
            await this.usersRepository.save(user);
            return new UpdateUserPayload(currUser.id);
        } else {
            throw new Error('[Update-User] User Not Found.');
        }
    }

    async updateStatus(
        input: UpdateUserStatusInput,
    ): Promise<UpdateUserPayload> {
        const user = await this.usersRepository.findOne(input.id);

        user.status = input.userStatus;
        try {
            await this.usersRepository.save(user);
            return new UpdateUserPayload(input.id);
        } catch (error) {
            throw new Error(
                `[User-Update] Status couldn't be updated. User: ${input.id}`,
            );
        }
    }

    async findAll(currUser: User): Promise<User[]> {
        const institution = (await this.usersRepository.findOne(currUser.id))
            .institution;
        return this.usersRepository.find({
            where: { institution: institution },
        });
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

    async generateUserToken(
        user: User,
        tokenPreferences: GenerateUserTokenInput,
    ): Promise<GenerateUserTokenPayload> {
        const instAlias = (await this.usersRepository.findOne(user.id))
            .institution.alias;
        const userRole = tokenPreferences.userRole[0];
        let token = instAlias + '#' + userRole + '@';
        if (tokenPreferences.classUUID) {
            const classToken = (
                await this.classesService.findOne(tokenPreferences.classUUID)
            ).classToken;
            token += classToken;
        }
        return new GenerateUserTokenPayload(token);
    }
}
