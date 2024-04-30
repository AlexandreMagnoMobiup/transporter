import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';


function getMysqlConnection()  {
    const connection = createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: 10
    });
    return connection;
}

function closeMysqlConnection(pool) {
    return pool.end();
}

export { getMysqlConnection, closeMysqlConnection };