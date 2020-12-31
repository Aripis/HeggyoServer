import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersModule } from 'src/teachers/teachers.module';
import { UsersModule } from 'src/users/users.module';
import { Class } from './class.model';
import { ClassesResolver } from './classes.resolver';
import { ClassesService } from './classes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Class]),
        forwardRef(() => TeachersModule),
        forwardRef(() => UsersModule),
    ],
    providers: [ClassesResolver, ClassesService],
    exports: [ClassesService],
})
export class ClassesModule {}
