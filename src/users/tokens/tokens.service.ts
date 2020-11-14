// import {
//     Injectable,
//     ConflictException,
//     InternalServerErrorException,
//     NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { InstitutionTokenInput } from './institutionToken.input';
// import { InstitutionToken } from './institutionToken.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class TokensService {
//     constructor(
//         @InjectRepository(InstitutionToken)
//         private readonly institutionTokensRepository: Repository<
//             InstitutionToken
//         >,
//     ) {}

//     async create(
//         institutionTokenInput: InstitutionTokenInput,
//     ): Promise<InstitutionToken> {
//         const institutionToken = new InstitutionToken();

//         Object.assign(institutionToken, institutionTokenInput);

//         try {
//             institutionToken.token = await bcrypt.hash(
//                 institutionToken.token,
//                 10,
//             );
//             const result = await this.institutionTokensRepository.save(
//                 institutionToken,
//             );
//             return result;
//         } catch (error) {
//             if (error.code === 'ER_DUP_ENTRY') {
//                 throw new ConflictException(
//                     'The InstitutionToken already exists',
//                 );
//             }
//             throw new InternalServerErrorException(error);
//         }
//     }

//     update(InstitutionToken: InstitutionToken) {
//         return this.institutionTokensRepository.save(InstitutionToken);
//     }

//     findAll(): Promise<InstitutionToken[]> {
//         return this.institutionTokensRepository.find();
//     }

//     async findOne(id: number | string): Promise<InstitutionToken> {
//         let InstitutionToken = null;
//         if (typeof id === 'number') {
//             InstitutionToken = await this.institutionTokensRepository.findOne(
//                 id,
//             );
//         } else if (typeof id === 'string') {
//             InstitutionToken = await this.institutionTokensRepository.findOne({
//                 where: { email: id },
//             });
//         }
//         if (!InstitutionToken) {
//             throw new NotFoundException(id);
//         }
//         return InstitutionToken;
//     }

//     async remove(id: number): Promise<void> {
//         await this.institutionTokensRepository.delete(id);
//     }

//     generateInstitutionTokenTokens() {
//         console.log(this.generateUniqueToken());
//     }

//     private generateUniqueToken(): string {
//         return (
//             '_' +
//             Math.random()
//                 .toString(36)
//                 .substr(2, 6)
//         );
//     }
// }
