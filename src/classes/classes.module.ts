import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersModule } from 'src/teachers/teachers.module';
import { InstitutionsModule } from '../institution/institutions.module';
import { Class } from './class.model';
import { ClassesResolver } from './classes.resolver';
import { ClassesService } from './classes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        TeachersModule,
        InstitutionsModule,
    ],
    providers: [ClassesResolver, ClassesService],
    exports: [ClassesService],
})
export class ClassesModule {}
