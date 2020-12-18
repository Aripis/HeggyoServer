import { forwardRef, Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { UsersModule } from 'src/users/users.module';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ClassesModule } from 'src/classes/classes.module';
import { Message } from './message.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        forwardRef(() => UsersModule),
        forwardRef(() => ClassesModule),
    ],
    providers: [MessageResolver, MessageService, DateScalar],
    exports: [MessageService],
})
export class MessageModule {}
