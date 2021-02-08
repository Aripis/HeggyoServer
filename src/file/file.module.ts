import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadScalar } from 'src/common/scalars/upload.scalar';
import { File } from './file.model';
import { FileService } from './file.service';

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    providers: [FileService, UploadScalar],
    exports: [FileService],
})
export class FileModule {}
