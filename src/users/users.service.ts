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
import { TeachersService } from './teachers/teachers.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly institutionsService: InstitutionsService,
        private readonly teacherService: TeachersService,

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
        const [role, _] = userSpecific.split('+');
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

                    await this.teacherService.create(resultUser);
                    break;
                }
                case 's': {
                    //student
                    user.userRole = UserRoles.STUDENT;
                    resultUser = this.usersRepository.save(user);

                    //TODO: IF classID link to class IF EXISTS
                    //detail might be classID
                    break;
                }
                case 'p': {
                    //parent
                    user.userRole = UserRoles.PARENT;
                    resultUser = this.usersRepository.save(user);

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
