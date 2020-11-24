import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.model';
import { ClassesResolver } from './classes.resolver';
import { ClassesService } from './classes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Class])],
    providers: [ClassesResolver, ClassesService],
    exports: [ClassesService],
})
export class ClassesModule {}
