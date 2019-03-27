import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let dbname = process.env.NODE_ENV === 'test' ? process.env.TESTDBNAME : process.env.DBNAME;

const sequelize = new Sequelize(dbname,process.env.DBUSERNAME,process.env.DBPASSWORD,{
  host: process.env.DBHOST,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});
export default sequelize;
