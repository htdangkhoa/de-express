import supertest from 'supertest';
import { bootstrap } from '../example';

let request;

before(async () => {
  const server = await bootstrap();

  request = supertest(server);
});

describe('GET /middlewares/simple', () => {
  it('Should return object with message is true.', async () => {
    const { body } = await request.get('/middlewares/simple');

    body.message.should.equal(true);
  });
});
