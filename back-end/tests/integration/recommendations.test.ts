import supertest from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database';
import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

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

  it('Does not create recommendation with invalid name', async () => {
    const recommendation = {
      name: Number(faker.random.numeric(5)),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);

    expect(result.status).toEqual(422);
  });

  it('Does not create recommendation with url from other domain', async () => {
    const recommendation = {
      name: faker.lorem.word(),
      youtubeLink: `https://www.${faker.random.alpha(
        5
      )}.com/${faker.random.alpha(10)}`,
    };

    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);

    expect(result.status).toEqual(422);
  });
});
