import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { User } from '../users/user.model';
import { Parent } from './parent.model';
import { StudentsService } from '../students/students.service';
import { UpdateParentInput } from './parent-input/update-parent.input';
import { UpdateParentPayload } from './parent-payload/update-parent.payload';

@Injectable()
export class ParentsService {
    constructor(
        private readonly studentsService: StudentsService,

        @InjectRepository(Parent)
        private readonly parentssRepository: Repository<Parent>,
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
            return this.parentssRepository.save(parent);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This parent already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(parent: UpdateParentInput): Promise<UpdateParentPayload> {
        const { id, ...data } = parent;
        await this.parentssRepository.update(id, data);
        return new UpdateParentPayload(id);
    }

    findAll(): Promise<Parent[]> {
        return this.parentssRepository.find();
    }

    async findOne(uuid: string): Promise<Parent> {
        const parent = await this.parentssRepository.findOne({
            where: { id: uuid },
        });
        if (!parent) {
            throw new NotFoundException(uuid);
        }
        return parent;
    }

    async remove(uuid: string): Promise<void> {
        await this.parentssRepository.delete(uuid);
    }
}
