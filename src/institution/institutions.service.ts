import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitutionInput } from './institution.input';
import { Institution } from './institution.model';

@Injectable()
export class InstitutionsService {
    constructor(
        @InjectRepository(Institution)
        private readonly institutionsRepository: Repository<Institution>,
    ) {}

    async create(institutionInput: InstitutionInput): Promise<Institution> {
        const institution = new Institution();
        Object.assign(institution, institutionInput);
        try {
            const result = await this.institutionsRepository.save(institution);
            return result;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This institution already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    update(institution: Institution) {
        return this.institutionsRepository.save(institution);
    }

    findAll(): Promise<Institution[]> {
        return this.institutionsRepository.find();
    }

    async findOne(uuid: string): Promise<Institution> {
        let institution = null;
        institution = await this.institutionsRepository.findOne(uuid);
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

    async remove(uuid: string): Promise<void> {
        await this.institutionsRepository.delete(uuid);
    }
}
