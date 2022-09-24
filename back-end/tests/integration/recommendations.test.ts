import supertest from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/database';
import { faker } from '@faker-js/faker';
import createRecommendation from '../factories/recommendationFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(() => {
  prisma.$disconnect;
});

describe('Testing POST /recommendations', () => {
  it('Creates valid recommendation', async () => {
    const recommendation = createRecommendation();

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
    const recommendation = createRecommendation();

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
    const recommendation = createRecommendation();

    await supertest(app).post('/recommendations').send(recommendation);

    const request = await supertest(app).get('/recommendations');

    const idThatDoesNotExists = request.body[0].id + 1;

    const result = await supertest(app).post(
      `/recommendations/${idThatDoesNotExists}/upvote`
    );

    expect(result.status).toEqual(404);
  });
});

describe('Testing POST /recommendations/:id/downvote', () => {
  it('Returns 200 for downvote in a recommendation with score=-4 and keeps the recommendation', async () => {
    const recommendation = createRecommendation();

    await supertest(app).post('/recommendations').send(recommendation);

    const requestBeforeDownvotes = await supertest(app).get('/recommendations');

    const recommendationId = requestBeforeDownvotes.body[0].id;

    for (let i = 0; i < 4; i++) {
      await supertest(app).post(
        `/recommendations/${recommendationId}/downvote`
      );
    }

    const requestBeforeLastDownvote = await supertest(app).get(
      '/recommendations'
    );

    await supertest(app).post(`/recommendations/${recommendationId}/downvote`);

    const requestAfterLastDownvote = await supertest(app).get(
      '/recommendations'
    );

    expect(requestBeforeLastDownvote.body[0].score).toEqual(-4);
    expect(requestAfterLastDownvote.body[0].score).toEqual(-5);
    expect(requestAfterLastDownvote.status).toEqual(200);
  });
  it('Returns 200 for downvote in a recommendation with score=-5 and deletes the recommendation', async () => {
    const recommendation = {
      name: faker.lorem.word(),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    await supertest(app).post('/recommendations').send(recommendation);

    const requestBeforeDownvotes = await supertest(app).get('/recommendations');

    const recommendationId = requestBeforeDownvotes.body[0].id;

    for (let i = 0; i < 5; i++) {
      await supertest(app).post(
        `/recommendations/${recommendationId}/downvote`
      );
    }

    const requestBeforeLastDownvote = await supertest(app).get(
      '/recommendations'
    );

    await supertest(app).post(`/recommendations/${recommendationId}/downvote`);

    const requestAfterLastDownvote = await supertest(app).get(
      '/recommendations'
    );

    expect(requestBeforeLastDownvote.body[0].score).toEqual(-5);
    expect(requestAfterLastDownvote.status).toEqual(200);
    expect(requestAfterLastDownvote.body.data).toEqual(undefined);
    expect(requestAfterLastDownvote.status).toEqual(200);
  });
});

describe('Testing GET /recommendations', () => {
  it('Returns 200 and an array with at maximum 10 recommendations', async () => {
    const numberOfRecommendationsSent = Number(faker.random.numeric(1));

    for (let i = 0; i < numberOfRecommendationsSent; i++) {
      const recommendation = createRecommendation();

      await supertest(app).post('/recommendations').send(recommendation);
    }

    const result = await supertest(app).get('/recommendations');

    expect(result.body.length).toEqual(numberOfRecommendationsSent);
    expect(result.status).toEqual(200);
  });
});

describe('Testing GET /recommendations/:id', () => {
  it('Returns 200 and one recommendation with the correct id', async () => {
    const recommendation = createRecommendation();

    await supertest(app).post('/recommendations').send(recommendation);

    const request = await supertest(app).get('/recommendations');

    const recommendationId = request.body[0].id;

    const result = await supertest(app).get(
      `/recommendations/${recommendationId}`
    );

    expect(result.status).toEqual(200);
    expect(result.body.id).toEqual(recommendationId);
  });
});

describe('Testing GET /recommendations/random', () => {
  it('Returns 200 and a recommendation', async () => {
    for (let i = 0; i < 5; i++) {
      const recommendation = createRecommendation();

      await supertest(app).post('/recommendations').send(recommendation);
    }

    const result = await supertest(app).get('/recommendations/random');

    expect(result.body).toBeInstanceOf(Object);
    expect(result.status).toEqual(200);
  });
  it('Returns 404 if there are no recommendations', async () => {
    const result = await supertest(app).get('/recommendations/random');

    expect(result.status).toEqual(404);
  });
});

describe('Testing GET /recommendations/top/:amount', () => {
  it('Returns 200 and an object with the amount of recommendations inside', async () => {
    for (let i = 0; i < 10; i++) {
      const recommendation = createRecommendation();

      await supertest(app).post('/recommendations').send(recommendation);
    }

    const randomNumber = Number(faker.random.numeric(1));

    const result = await supertest(app).get(
      `/recommendations/top/${randomNumber}`
    );

    expect(result.body.length).toEqual(randomNumber);
    expect(result.status).toEqual(200);
  });
});
