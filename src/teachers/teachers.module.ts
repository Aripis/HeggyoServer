import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Teacher } from './teacher.model';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teacher]),
        forwardRef(() => ClassesModule),
        forwardRef(() => UsersModule),
    ],
    providers: [TeachersResolver, TeachersService],
    exports: [TeachersService],
})
export class TeachersModule {}
