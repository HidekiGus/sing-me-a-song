import * as testRepository from '../repositories/testRepository.js';

export async function resetDatabase() {
  await testRepository.resetDatabase();
}
