import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionEntity } from './institution.entity';
import { InstitutionsResolver } from './institutions.resolver';
import { InstitutionsService } from './institutions.service';
import { DateScalar } from '../common/scalars/date.scalar';

@Module({
    imports: [TypeOrmModule.forFeature([InstitutionEntity])],
    providers: [InstitutionsResolver, InstitutionsService, DateScalar],
    exports: [InstitutionsService],
})
export class InstitutionsModule {}
