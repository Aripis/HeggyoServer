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

@Injectable()
export class InstitutionsService {
    constructor(
        @InjectRepository(Institution)
        private readonly institutionsRepository: Repository<Institution>,
    ) {}

    async create(
        institutionInput: CreateInstitutionInput,
    ): Promise<CreateInstitutionPayload> {
        const institution = new Institution();
        Object.assign(institution, institutionInput);
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
        institution: UpdateInstitutionInput,
    ): Promise<UpdateInstitutionPayload> {
        const { id, ...rest } = institution;
        await this.institutionsRepository.update(id, rest);
        return new UpdateInstitutionPayload(id);
    }

    findAll(): Promise<Institution[]> {
        return this.institutionsRepository.find();
    }

    async findOne(uuid: string): Promise<Institution> {
        let institution = null;
        institution = await this.institutionsRepository.findOne({
            where: { id: uuid },
        });
        if (!institution) {
            throw new NotFoundException(uuid);
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

    async remove(uuid: string): Promise<RemoveInstitutionPayload> {
        await this.institutionsRepository.delete(uuid);
        return new RemoveInstitutionPayload(true);
    }
}
