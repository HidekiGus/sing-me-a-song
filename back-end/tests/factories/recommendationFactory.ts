import { faker } from '@faker-js/faker';

export default function createRecommendation() {
  const recommendation = {
    name: faker.lorem.word(),
    youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
  };

  return recommendation;
}
