import { StudentModule } from '../student/student.module';
import { UserModule } from 'src/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ParentResolver } from './parent.resolver';
import { ParentService } from './parent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './parent.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Parent]),
        forwardRef(() => UserModule),
        forwardRef(() => StudentModule),
    ],
    providers: [ParentResolver, ParentService],
    exports: [ParentService],
})
export class ParentModule {}
