/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { CreateWriteStreamOptions, Storage } from '@google-cloud/storage';
import { File } from './file.model';
import { MetadataResponse } from '@google-cloud/common/build/src/service-object';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

@Injectable()
export class FileService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    private rawCredentials = JSON.parse(
        this.configService.get<string>('SERVICE_ACCOUNT_CREDENTIALS'),
    );

    private credentials = {
        ...this.rawCredentials,
        private_key: this.rawCredentials.private_key.replace(/\\n/g, '\n'),
    };

    private readonly gcloudStorage = new Storage({
        credentials: this.credentials,
    });

    private readonly defaultBucket = this.configService.get<string>(
        'GCS_BUCKET_NAME',
    );

    async getCloudFileMeta(
        path: string,
        bucket = this.defaultBucket,
    ): Promise<MetadataResponse[0]> {
        const file = this.gcloudStorage.bucket(bucket).file(path);
        const [{ id, name, contentType, mediaLink }] = await file.getMetadata();
        return {
            id,
            name,
            contentType,
            mediaLink,
        };
    }

    getCloudFile(file: File, bucket = this.defaultBucket): File {
        file.publicUrl = `https://storage.googleapis.com/${bucket}/${file.cloudFilename}`;
        return file;
    }

    async uploadCloudFileFromStream(
        filename: string,
        createReadStream: Function,
        options: CreateWriteStreamOptions = {},
        bucket = this.defaultBucket,
    ): Promise<MetadataResponse[0]> {
        const buffer = await streamToBuffer(createReadStream());
        const file = this.gcloudStorage.bucket(bucket).file(filename);

        await file.save(buffer, options);
        await file.makePublic();

        return this.getCloudFileMeta(filename);
    }

    async removeFileById(id: string, bucket = this.defaultBucket) {
        const file = await this.fileRepository.findOne({
            where: {
                id,
            },
        });

        await this.gcloudStorage
            .bucket(bucket)
            .file(file.cloudFilename)
            .delete();

        return this.fileRepository.remove(file);
    }
}
