import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { DateScalar } from '../common/scalars/date.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { Module } from '@nestjs/common';
import { File } from './file.model';

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    providers: [FileService, UploadScalar, DateScalar],
    exports: [FileService],
})
export class FileModule {}
