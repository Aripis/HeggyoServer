import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.model';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher])],
    providers: [TeachersResolver, TeachersService],
    exports: [TeachersService],
})
export class TeachersModule {}
