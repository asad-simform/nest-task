import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

// const configService: ConfigService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../database/entities/*{.js,.ts}'],
    migrations: [__dirname + '/../database/migrations/*{.js,.ts}'],
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
