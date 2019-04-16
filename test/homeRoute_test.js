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
  it('should return the landing page', async () => {
    const res = await chai.request(index).get('/');
    res.should.have.status(200);
  });
});
