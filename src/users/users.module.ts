import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { DateScalar } from '../common/scalars/date.scalar';
import { InstitutionsModule } from 'src/institution/institutions.module';

@Module({
    imports: [InstitutionsModule, TypeOrmModule.forFeature([User])],
    providers: [UsersResolver, UsersService, DateScalar],
    exports: [UsersService],
})
export class UsersModule {}
