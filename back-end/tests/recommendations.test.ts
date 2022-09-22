import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import { faker } from '@faker-js/faker';

describe('Testing POST /recommendations', () => {
  it('Create valid recommendation', async () => {
    const recommendation = {
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);

    expect(result.status).toEqual(201);
  });
});
