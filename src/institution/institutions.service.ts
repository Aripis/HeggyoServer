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
        institution.token = this.generateUniqueToken();
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

    async findOneByToken(token: string): Promise<Institution> {
        let institution = null;
        institution = await this.institutionsRepository.findOne({
            where: { token: token },
        });
        if (!institution) {
            throw new NotFoundException(token);
        }
        return institution;
    }

    async remove(id: number): Promise<void> {
        await this.institutionsRepository.delete(id);
    }

    private generateUniqueToken(): string {
        //FIXME: Make sure it's unique for all insatutions
        return (
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 5)
        );
    }
}
