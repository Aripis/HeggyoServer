import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { UpdateParentInput } from './parent-input/update-parent.input';
import { ParentPayload } from './parent-payload/parent.payload';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Parent } from './parent.model';
import { Repository } from 'typeorm';

@Injectable()
export class ParentService {
    constructor(
        @Inject(forwardRef(() => StudentService))
        private readonly studentService: StudentService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        @InjectRepository(Parent)
        private readonly parentRepository: Repository<Parent>,
    ) {}

    async add(user: User, childrenIds: string[]): Promise<Parent> {
        const newParent = new Parent();
        const students = [];

        newParent.user = user;

        for (const id of childrenIds) {
            students.push(await this.studentService.findOne(id));
        }

        newParent.students = students;

        try {
            return this.parentRepository.save(newParent);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Parent] This parent already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateParentInput): Promise<ParentPayload> {
        const { id, ...data } = input;

        try {
            await this.parentRepository.update(id, data);
            return new ParentPayload(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(currUser: User): Promise<Parent[]> {
        const usersIds = (await this.userService.findAll(currUser)).map(
            (user: User) => user.id,
        );
        const parents = await this.parentRepository.find();

        return parents.filter(parent => usersIds.includes(parent.user.id));
    }

    async findOne(id: string): Promise<Parent> {
        const parent = await this.parentRepository.findOne({
            where: { id: id },
        });

        if (!parent) {
            throw new NotFoundException(id);
        }

        return parent;
    }

    async findOneByUser(currUser: User): Promise<Parent> {
        const parents = await this.parentRepository.find();

        if (!parents) {
            throw new NotFoundException(currUser.id);
        }

        return parents.filter(p => p.user.id === currUser.id)[0];
    }

    async findOneByUserId(
        id: string,
        relations: string[] = null,
    ): Promise<Parent> {
        const parents = await this.parentRepository.find({
            relations: relations || [],
        });
        const parent = parents.find(parent => parent.user.id === id);

        if (!parent) {
            throw new NotFoundException(id);
        }

        return parent;
    }

    async remove(id: string): Promise<ParentPayload> {
        await this.parentRepository.delete(id);
        return new ParentPayload(id);
    }
}
