import supertest from 'supertest';
import { bootstrap } from '../example';

let request;

before(async () => {
  const app = await bootstrap();

  request = supertest(app);
});

describe('GET /', () => {
  it('Should return object.', async () => {
    const { body } = await request.get('/');

    body.message.should.equal('Hello world!!!');
  });
});

describe('GET /?greeting=ping_pong', () => {
  it(`Should return object with message is 'ping_pong'.`, async () => {
    const { body } = await request.get('/').query({ greeting: 'ping_pong' });

    body.message.should.equal('Hello ping_pong!!!');
  });
});

describe('GET /home', () => {
  it('Should render html.', async () => {
    const { text } = await request.get('/home');

    text.should.match(/Render home/);
  });
});

describe('GET /home-with-message', () => {
  it('Should render html with message.', async () => {
    const { text } = await request.get('/home-with-message');

    text.should.match(/Message: bar/);
  });
});
