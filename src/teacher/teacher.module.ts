import { TeacherResolver } from './teacher.resolver';
import { ClassModule } from 'src/class/class.module';
import { Module, forwardRef } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teacher]),
        forwardRef(() => ClassModule),
        forwardRef(() => UserModule),
    ],
    providers: [TeacherResolver, TeacherService],
    exports: [TeacherService],
})
export class TeacherModule {}
