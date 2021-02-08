import { forwardRef, Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { UsersModule } from 'src/users/users.module';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ClassesModule } from 'src/classes/classes.module';
import { StudentsModule } from 'src/students/students.module';
import { Message } from './message.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { FileModule } from 'src/file/file.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        forwardRef(() => UsersModule),
        forwardRef(() => ClassesModule),
        forwardRef(() => StudentsModule),
        SubjectsModule,
        FileModule,
    ],
    providers: [MessageResolver, MessageService, DateScalar],
    exports: [MessageService],
})
export class MessageModule {}
