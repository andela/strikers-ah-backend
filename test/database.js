import chai from 'chai';
import dotenv from 'dotenv';
import sequelize from '../config/config';

dotenv.config();

chai.should();
describe('Test database connection', () => {
  it('should start the database engine', (done) => {
    sequelize.should.have.property('development');
    sequelize.development.should.have.property('host').eql(process.env.DBHOST);
    sequelize.development.should.have.property('username').eql(process.env.DBUSERNAME);
    sequelize.development.should.have.property('database').eql(process.env.DBNAME);
    sequelize.development.should.have.property('password').eql(process.env.DBPASSWORD);
    sequelize.should.be.a('object');
    sequelize.should.have.property('test');
    sequelize.test.should.have.property('host').eql(process.env.DBHOST);
    sequelize.test.should.have.property('username').eql(process.env.DBUSERNAME);
    sequelize.test.should.have.property('database').eql(process.env.TESTDBNAME);
    // sequelize.test.should.have.property('password').eql(process.env.DBPASSWORD);
    done();
  });
});
