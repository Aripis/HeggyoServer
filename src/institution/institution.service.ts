import {
    InternalServerErrorException,
    ConflictException,
    NotFoundException,
    Injectable,
    forwardRef,
    Inject,
} from '@nestjs/common';
import { UpdateInstitutionInput } from './institution-input/update-institution.input';
import { AddInstitutionInput } from './institution-input/add-institution.input';
import { InstitutionPayload } from './institution-payload/institution.payload';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Institution } from './institution.model';
import { User } from 'src/user/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutionService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>,
    ) {}

    async add(input: AddInstitutionInput): Promise<InstitutionPayload> {
        const institution = new Institution();

        Object.assign(institution, input);

        try {
            return new InstitutionPayload(
                (await this.institutionRepository.save(institution)).id,
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Institution] This institution already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(input: UpdateInstitutionInput): Promise<InstitutionPayload> {
        const { id, ...data } = input;

        if (await this.institutionRepository.findOne(id)) {
            this.institutionRepository.update(id, data);
            return new InstitutionPayload(id);
        } else {
            throw new NotFoundException(
                '[Update-Institution] Institution Not Found.',
            );
        }
    }

    findAll(): Promise<Institution[]> {
        return this.institutionRepository.find();
    }

    async findOne(user: User): Promise<Institution> {
        const institution = (await this.userService.findOne(user.id))
            .institution;

        if (!institution) {
            throw new NotFoundException();
        }

        return institution;
    }

    async findOneByAlias(alias: string): Promise<Institution> {
        const institution = await this.institutionRepository.findOne({
            where: { alias: alias },
        });

        if (!institution) {
            throw new NotFoundException(alias);
        }
        return institution;
    }

    async remove(currUser: User): Promise<InstitutionPayload> {
        const instId = (await this.userService.findOne(currUser.id)).institution
            .id;

        await this.institutionRepository.delete(instId);

        return new InstitutionPayload(instId);
    }
}
