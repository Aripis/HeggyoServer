import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
    Inject,
} from '@nestjs/common';

import { User } from '../users/user.model';
import { Parent } from './parent.model';
import { StudentsService } from '../students/students.service';
import { UpdateParentInput } from './parent-input/update-parent.input';
import { UpdateParentPayload } from './parent-payload/update-parent.payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ParentsService {
    constructor(
        private readonly studentsService: StudentsService,
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,

        @InjectRepository(Parent)
        private readonly parentsRepository: Repository<Parent>,
    ) {}

    async create(user: User, childrenUUIDs: string[]): Promise<Parent> {
        const parent = new Parent();
        if (user) {
            parent.user = user;
        }
        const children = [];
        for (const uuid of childrenUUIDs) {
            children.push(await this.studentsService.findOne(uuid));
        }

        parent.children = children;
        try {
            return this.parentsRepository.save(parent);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This parent already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        updateParentInput: UpdateParentInput,
    ): Promise<UpdateParentPayload> {
        const { id, ...data } = updateParentInput;
        if (await this.parentsRepository.findOne(id)) {
            await this.parentsRepository.update(id, data);
            return new UpdateParentPayload(id);
        } else {
            throw new NotFoundException('[Update-Parent] Parent Not Found.');
        }
    }

    async findAll(currUser: User): Promise<Parent[]> {
        const users = await this.userService.findAll(currUser);
        const parents = await this.parentsRepository.find();
        return parents.filter(parent =>
            users.map(user => parent.user.id === user.id),
        );
    }

    async findOne(uuid: string): Promise<Parent> {
        const parent = await this.parentsRepository.findOne({
            where: { id: uuid },
        });
        if (!parent) {
            throw new NotFoundException(uuid);
        }
        return parent;
    }

    async remove(uuid: string): Promise<void> {
        await this.parentsRepository.delete(uuid);
    }
}
