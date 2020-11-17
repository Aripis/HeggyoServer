import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './institution.model';
import { InstitutionsResolver } from './institutions.resolver';
import { InstitutionsService } from './institutions.service';
import { DateScalar } from '../common/scalars/date.scalar';

@Module({
    imports: [TypeOrmModule.forFeature([Institution])],
    providers: [InstitutionsResolver, InstitutionsService, DateScalar],
    exports: [InstitutionsService],
})
export class InstitutionsModule {}
