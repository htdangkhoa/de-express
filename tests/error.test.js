import supertest from 'supertest';
import { bootstrap } from '../example';

let request;

before(async () => {
  const server = await bootstrap();

  request = supertest(server);
});

describe('GET /error', () => {
  it('Should return object with code is 500.', async () => {
    const { body } = await request.get('/error');

    body.code.should.equal(500);
  });
});

describe('POST /error', () => {
  it('Should return object with code is 404.', async () => {
    const { body } = await request.post('/error');

    body.code.should.equal(404);
  });
});
