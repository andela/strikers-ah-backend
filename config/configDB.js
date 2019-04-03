import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.TESTDBNAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.USERNAME_PRODUCTION,
    password: process.env.PASSWORD_PRODUCTION,
    database: process.env.DB_PRODUCTION,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres'
  }
};

export default config;
