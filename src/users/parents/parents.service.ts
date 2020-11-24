import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { User } from '../user.model';
import { Parent } from './parent.model';
import { ParentInput } from './parent.input';
import { StudentsService } from '../students/students.service';

@Injectable()
export class ParentsService {
    constructor(
        private readonly studentsService: StudentsService,

        @InjectRepository(Parent)
        private readonly parentssRepository: Repository<Parent>,
    ) {}

    async create(
        parentInput: ParentInput,
        user: User,
        childrenUUIDs: string[],
    ): Promise<Parent> {
        const parent = new Parent();
        Object.assign(parent, parentInput);
        if (user) {
            parent.user = user;
        }
        const children = [];
        childrenUUIDs.forEach(uuid => {
            children.push(this.studentsService.findOne(uuid));
        });

        //TODO: link to user IF EXISTS else raise error - no such kid
        //      (should be impossible to raise this error)
        //detail might be [userID]
        // const kidsUUIDs = detail.split(',');
        // kidsUUIDs;

        try {
            return this.parentssRepository.save(parent);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This parent already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    update(parent: Parent) {
        return this.parentssRepository.save(parent);
    }

    findAll(): Promise<Parent[]> {
        return this.parentssRepository.find();
    }

    async findOne(uuid: string): Promise<Parent> {
        const parent = await this.parentssRepository.findOne(uuid);
        if (!parent) {
            throw new NotFoundException(uuid);
        }
        return parent;
    }

    async remove(uuid: string): Promise<void> {
        await this.parentssRepository.delete(uuid);
    }
}
