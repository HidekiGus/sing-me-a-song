import { faker } from '@faker-js/faker';
import * as testRepository from '../repositories/testRepository.js';

export async function resetDatabase() {
  await testRepository.resetDatabase();
}

export async function addRecommendation() {
  const name = faker.lorem.words(2);
  const youtubeLink = `https://www.youtube.com/${faker.lorem.word}`;
  await testRepository.addRecommendation(name, youtubeLink);
}
