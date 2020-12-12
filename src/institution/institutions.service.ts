import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstitutionInput } from './institution-input/create-institution.input';
import { CreateInstitutionPayload } from './institution-payload/create-institution.payload';
import { Institution } from './institution.model';
import { RemoveInstitutionPayload } from './institution-payload/remove-institution.payload';
import { UpdateInstitutionInput } from './institution-input/update-institution.input';
import { UpdateInstitutionPayload } from './institution-payload/update-institution.payload';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InstitutionsService {
    constructor(
        private readonly userService: UsersService,

        @InjectRepository(Institution)
        private readonly institutionsRepository: Repository<Institution>,
    ) {}

    async create(
        createInstitutionInput: CreateInstitutionInput,
    ): Promise<CreateInstitutionPayload> {
        const institution = new Institution();
        Object.assign(institution, createInstitutionInput);
        try {
            const inst = await this.institutionsRepository.save(institution);
            return new CreateInstitutionPayload(inst.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This institution already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        updateInstitutionInput: UpdateInstitutionInput,
    ): Promise<UpdateInstitutionPayload> {
        const { id, ...rest } = updateInstitutionInput;
        if (await this.institutionsRepository.findOne(id)) {
            this.institutionsRepository.update(id, rest);
            return new UpdateInstitutionPayload(id);
        } else {
            throw new NotFoundException(
                '[Update-Institution] Institution Not Found.',
            );
        }
    }

    findAll(): Promise<Institution[]> {
        return this.institutionsRepository.find();
    }

    async findOne(user: User): Promise<Institution> {
        const instId = (await this.userService.findOne(user.id)).institution[0]
            .id;
        let institution = await this.institutionsRepository.findOne(instId);
        if (!institution) {
            institution = await this.institutionsRepository.findOne({
                where: { email: instId },
            });
        }
        if (!institution) {
            throw new NotFoundException(instId);
        }
        return institution;
    }

    async findOneByAlias(instAlias: string): Promise<Institution> {
        const institution = await this.institutionsRepository.findOne({
            where: { alias: instAlias },
        });
        if (!institution) {
            throw new NotFoundException(instAlias);
        }
        return institution;
    }

    async remove(currUser: User): Promise<RemoveInstitutionPayload> {
        const instId = (await this.userService.findOne(currUser.id))
            .institution[0].id;
        await this.institutionsRepository.delete(instId);
        return new RemoveInstitutionPayload(true);
    }
}
