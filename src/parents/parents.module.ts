import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './parent.model';
import { ParentsService } from './parents.service';
import { StudentsModule } from '../students/students.module';
import { ParentsResolver } from './parents.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Parent]), StudentsModule, forwardRef(() => UsersModule)],
    providers: [ParentsResolver, ParentsService],
    exports: [ParentsService],
})
export class ParentsModule {}
