import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.model';
import { SubjectsResolver } from './subjects.resolver';
import { SubjectService } from './subjects.service';

@Module({
    imports: [TypeOrmModule.forFeature([Subject])],
    providers: [SubjectsResolver, SubjectService],
    exports: [SubjectService],
})
export class SubjectsModule {}
