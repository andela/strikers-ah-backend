import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.DBUSERNAME,
    password: process.env.PDBPASSWORD,
    database: process.env.TESTDBNAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};
