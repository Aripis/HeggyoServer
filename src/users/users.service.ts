import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput } from './user.input';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(userInput: UserInput): Promise<User> {
        const user = new User();

        Object.assign(user, userInput);

        try {
            user.password = await bcrypt.hash(user.password, 10);
            const result = await this.usersRepository.save(user);
            return result;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('The user already exists');
            }
            throw new InternalServerErrorException();
        }
    }

    update(user: User) {
        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number | string): Promise<User> {
        let user = null;
        if (typeof id === 'number') {
            user = await this.usersRepository.findOne(id);
        } else if (typeof id === 'string') {
            user = await this.usersRepository.findOne({
                where: { email: id },
            });
        }
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
