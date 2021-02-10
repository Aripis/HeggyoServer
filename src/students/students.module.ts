import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.model';
import { StudentsService } from './students.service';
import { ClassesModule } from 'src/classes/classes.module';
import { StudentsResolver } from './students.resolver';
import { UsersModule } from 'src/users/users.module';
import { FileModule } from 'src/file/file.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student]),
        forwardRef(() => UsersModule),
        forwardRef(() => ClassesModule),
        FileModule,
    ],
    providers: [StudentsResolver, StudentsService],
    exports: [StudentsService],
})
export class StudentsModule {}
