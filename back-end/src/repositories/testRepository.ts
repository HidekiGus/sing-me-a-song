import { prisma } from '../database.js';

export async function resetDatabase() {
  await prisma.recommendation.deleteMany();
}

export async function addRecommendation(name: string, youtubeLink: string) {
  await prisma.recommendation.create({
    data: {
      name,
      youtubeLink,
    },
  });
}
