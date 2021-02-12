import { InstitutionResolver } from './institution.resolver';
import { InstitutionService } from './institution.service';
import { DateScalar } from '../common/scalars/date.scalar';
import { Module, forwardRef } from '@nestjs/common';
import { Institution } from './institution.model';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Institution]),
        forwardRef(() => UserModule),
    ],
    providers: [InstitutionResolver, InstitutionService, DateScalar],
    exports: [InstitutionService],
})
export class InstitutionModule {}
