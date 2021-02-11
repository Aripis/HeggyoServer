import {
    InternalServerErrorException,
    ConflictException,
    NotFoundException,
    Injectable,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { GenerateUserTokenPayload } from './user-payload/generate-user-token.payload';
import { GenerateUserTokenInput } from './user-input/generate-user-token.input';
import { UpdateUserStatusInput } from './user-input/update-user-status.input';
import { InstitutionService } from 'src/institution/institution.service';
import { UpdateUserInput } from './user-input/update-user.input';
import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';
import { AddUserInput } from './user-input/add-user.input';
import { UserPayload } from './user-payload/user.payload';
import { ParentService } from '../parent/parent.service';
import { ClassService } from 'src/class/class.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => InstitutionService))
        private readonly institutionService: InstitutionService,
        @Inject(forwardRef(() => TeacherService))
        private readonly teacherService: TeacherService,
        @Inject(forwardRef(() => ClassService))
        private readonly classService: ClassService,
        @Inject(forwardRef(() => StudentService))
        private readonly studentService: StudentService,
        @Inject(forwardRef(() => ParentService))
        private readonly parentService: ParentService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async add(input: AddUserInput): Promise<UserPayload> {
        const user = new User();
        let resultUser: User, instAlias: string, userSpecific: string;

        if (input.photo) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { photo, ...data } = input;
            Object.assign(user, data);
            //TODO: photo is file... upload it
        } else {
            Object.assign(user, input);
        }

        if (user && user.registerToken) {
            [instAlias, userSpecific] = user.registerToken.split('#');
            user.institution = await this.institutionService.findOneByAlias(
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
                    user.role = UserRole.ADMIN;
                    resultUser = await this.userRepository.save(user);
                    break;
                }
                case 't': {
                    //teacher
                    user.role = UserRole.TEACHER;
                    resultUser = await this.userRepository.save(user);
                    const teacher = await this.teacherService.add(resultUser);
                    if (
                        additionalProps.length === 6 ||
                        additionalProps.length === 7
                    ) {
                        this.classService.assignTeacherToClass(
                            teacher,
                            additionalProps,
                        );
                    }
                    break;
                }
                case 's': {
                    //student
                    user.role = UserRole.STUDENT;
                    resultUser = await this.userRepository.save(user);
                    this.studentService.add(resultUser, additionalProps);
                    break;
                }
                case 'p': {
                    //parent
                    user.role = UserRole.PARENT;
                    resultUser = await this.userRepository.save(user);
                    const students = additionalProps.split(',');
                    if (!students) {
                        throw new Error('Parent without students');
                    }
                    this.parentService.add(resultUser, students);
                    break;
                }
                case 'v': {
                    //viewer
                    //TODO: create logic for viewers
                }
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-User] The user already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
        return new UserPayload(resultUser.id);
    }

    async update(input: UpdateUserInput, currUser: User): Promise<UserPayload> {
        try {
            const user = await this.userRepository.findOne(currUser.id);
            Object.assign(user, input);

            await this.userRepository.save(user);
            return new UserPayload(currUser.id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateStatus(input: UpdateUserStatusInput): Promise<UserPayload> {
        const user = await this.userRepository.findOne(input.id);
        user.status = input.userStatus;

        try {
            await this.userRepository.save(user);
            return new UserPayload(input.id);
        } catch (error) {
            throw new Error(
                `[User-Update-Status] Status couldn't be updated. User: ${input.id}`,
            );
        }
    }

    async findAll(currUser: User): Promise<User[]> {
        const institution = (await this.userRepository.findOne(currUser.id))
            .institution;

        return this.userRepository.find({
            where: { institution: institution },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new NotFoundException(
                `[User-Find-One] User not found: ${id}`,
            );
        }

        return user;
    }

    async remove(id: string): Promise<UserPayload> {
        await this.userRepository.delete(id);
        return new UserPayload(id);
    }

    async generateUserToken(
        user: User,
        input: GenerateUserTokenInput,
    ): Promise<GenerateUserTokenPayload> {
        const instAlias = (await this.userRepository.findOne(user.id))
            .institution.alias;
        const role = input.role[0];
        let token = instAlias + '#' + role + '@';

        if (input.classId) {
            const classToken = (await this.classService.findOne(input.classId))
                .token;
            token += classToken;
        }

        return new GenerateUserTokenPayload(token);
    }
}
