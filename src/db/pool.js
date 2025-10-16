const { Pool } = require('pg');
require('dotenv').config();

const connectionOptions = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
      }
    : {
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      };

const pool = new Pool(connectionOptions);

module.exports = pool;