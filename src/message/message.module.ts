import { SubjectModule } from 'src/subject/subject.module';
import { StudentModule } from 'src/student/student.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { ClassModule } from 'src/class/class.module';
import { MessageResolver } from './message.resolver';
import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { FileModule } from 'src/file/file.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        forwardRef(() => StudentModule),
        forwardRef(() => ClassModule),
        forwardRef(() => UserModule),
        SubjectModule,
        FileModule,
    ],
    providers: [MessageResolver, MessageService, DateScalar],
    exports: [MessageService],
})
export class MessageModule {}
