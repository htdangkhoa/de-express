import { resolve } from 'path';
import supertest from 'supertest';
import { bootstrap } from '../example';

const imagePath = resolve(__dirname, 'assets/placeholder.png');

let request;

before(async () => {
  const app = await bootstrap();

  request = supertest(app);
});

describe('POST /upload/single', () => {
  it(`Should return object with avatars is array.`, async () => {
    const { body } = await request
      .post('/upload/single')
      .attach('avatar', imagePath);

    body.avatar.should.be.Object();
  });
});

describe('POST /upload/multiple', () => {
  it(`Should return object with avatars is array.`, async () => {
    const { body } = await request
      .post('/upload/multiple')
      .attach('avatars', imagePath)
      .attach('avatars', imagePath);

    body.avatars.should.be.Array();

    body.avatars.length.should.equal(2);
  });
});

describe('POST /upload/multiple-fields', () => {
  it(`Should return object with avatars is array.`, async () => {
    const { body } = await request
      .post('/upload/multiple-fields')
      .attach('images', imagePath);

    body.files.images.should.be.Array();
  });
});
