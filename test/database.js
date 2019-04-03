import chai from 'chai';
import dotenv from 'dotenv';
import sequelize from '../config/configDB';

dotenv.config();

chai.should();
describe('Test database connection', () => {
  it('should start the database engine', (done) => {
    sequelize.should.be.a('object');
    sequelize.config.should.have.property('username').eql(process.env.DBUSERNAME);
    sequelize.config.should.have.property('database').eql(process.env.TESTDBNAME);
    done();
  });
});
