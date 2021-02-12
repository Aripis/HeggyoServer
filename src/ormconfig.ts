export const initDB = () => ({
    database: {
        type: process.env.DB_DRIVER,
        host: process.env.DB_HOST,
        extra: {
            socketPath: process.env.DB_SOCKET,
        },
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.model{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        migrationsRun: false, //process.env.NODE_ENV === 'production',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
            migrationsDir: 'src/migrations',
        },
    },
});

export default initDB().database;
