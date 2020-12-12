import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Teacher } from './teacher.model';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher]), forwardRef(() => UsersModule)],
    providers: [TeachersResolver, TeachersService],
    exports: [TeachersService],
})
export class TeachersModule {}
