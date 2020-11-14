import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitutionInput } from './institution.input';
import { InstitutionEntity } from './institution.entity';

@Injectable()
export class InstitutionsService {
    constructor(
        @InjectRepository(InstitutionEntity)
        private readonly institutionsRepository: Repository<InstitutionEntity>,
    ) {}

    async create(
        institutionInput: InstitutionInput,
    ): Promise<InstitutionEntity> {
        const institution = new InstitutionEntity();

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

    update(institution: InstitutionEntity) {
        return this.institutionsRepository.save(institution);
    }

    findAll(): Promise<InstitutionEntity[]> {
        return this.institutionsRepository.find();
    }

    async findOne(id: number | string): Promise<InstitutionEntity> {
        let institution = null;
        if (typeof id === 'number') {
            institution = await this.institutionsRepository.findOne(id);
        } else if (typeof id === 'string') {
            institution = await this.institutionsRepository.findOne({
                where: { email: id },
            });
        }
        if (!institution) {
            throw new NotFoundException(id);
        }
        return institution;
    }

    async remove(id: number): Promise<void> {
        await this.institutionsRepository.delete(id);
    }
}
