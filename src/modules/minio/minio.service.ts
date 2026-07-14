import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
    private minioClient!: Client;
    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.minioClient = new Client({
            endPoint: this.configService.get('MINIO_ENDPOINT')!,
            port: this.configService.get('MINIO_PORT')!,
            useSSL: false,
            accessKey: this.configService.get('MINIO_ACCESS_KEY')!,
            secretKey: this.configService.get('MINIO_SECRET_KEY')!,
        });
        const exists = await this.minioClient.bucketExists('sample-bucket');
        if (!exists) {
            await this.minioClient.makeBucket('sample-bucket', 'us-east-1');
            console.log('bucket created');
        } else {
            console.log('bucket exists');
        }
    }

    async uploadFile(uploadPath: string, filePath: string) {
        await this.minioClient.fPutObject(
            'sample-bucket',
            uploadPath,
            filePath,
        );
    }
}
