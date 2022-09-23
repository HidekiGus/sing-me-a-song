import supertest from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database';
import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

describe('Testing POST /recommendations', () => {
  it('Creates valid recommendation', async () => {
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

describe('Testing POST /recommendations/:id/upvote', () => {
  it('Returns 200 for an upvote in a valid recommendation', async () => {
    const recommendation = {
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    await supertest(app).post('/recommendations').send(recommendation);

    const requestBeforeUpvote = await supertest(app).get('/recommendations');

    const scoreBeforeUpvote = requestBeforeUpvote.body[0].score;

    const result = await supertest(app).post(
      `/recommendations/${requestBeforeUpvote.body[0].id}/upvote`
    );

    const requestAfterUpvote = await supertest(app).get('/recommendations');

    const scoreAfterUpvote = requestAfterUpvote.body[0].score;

    expect(result.status).toEqual(200);
    expect(scoreBeforeUpvote).toEqual(scoreAfterUpvote - 1);
  });

  it('Returns 404 for an upvote with an invalid id', async () => {
    const recommendation = {
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    await supertest(app).post('/recommendations').send(recommendation);

    const request = await supertest(app).get('/recommendations');

    const idThatDoesNotExists = request.body[0].id + 1;

    const result = await supertest(app).post(
      `/recommendations/${idThatDoesNotExists}/upvote`
    );

    expect(result.status).toEqual(404);
  });
});
