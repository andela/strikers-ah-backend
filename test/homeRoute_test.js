import chai from 'chai';
import chaiHttp from 'chai-http';
import index from '../index';

chai.should();
chai.use(chaiHttp);

/**
 * @author: Innocent Nkunzi
 * @description: tests related to article
 */
describe('Test the home route', () => {
  it('should return the landing page', (done) => {
    chai.request(index).get('/').then((res) => {
      res.should.have.status(200);
      res.body.should.have.property('message').eql('Welcome to Author Haven');
      done();
    })
      .catch(err => err);
  });
});
