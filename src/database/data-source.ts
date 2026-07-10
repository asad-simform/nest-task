import { ConfigService } from '@nestjs/config';
import { DATA_SOURCE } from 'src/config/constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: 5432,
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASS'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/entities/*{.js,.ts}'],
                migrations: [__dirname + '/migrations/*{.js,.ts}'],
                synchronize: false,
                logging: configService.get('NODE_ENV') === 'development',
            });
            return dataSource.initialize();
        },
        inject: [ConfigService],
    },
];
