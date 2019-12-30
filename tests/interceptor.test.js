import supertest from 'supertest';
import { bootstrap } from '../example';

let request;

before(async () => {
  const app = await bootstrap();

  request = supertest(app);
});

describe('GET /interceptors/basic', () => {
  it(`Should return object with foo is 'bar'.`, async () => {
    const { body } = await request.get('/interceptors/basic');

    body.foo.should.equal('bar');
  });
});

describe('GET /interceptors/transform', () => {
  it(`Should return object with oldData is '{ "foo": "bar" }' and newData is '{ "ping": "pong" }'.`, async () => {
    const { body } = await request.get('/interceptors/transform');

    body.oldData.foo.should.equal('bar');

    body.newData.ping.should.equal('pong');
  });
});
