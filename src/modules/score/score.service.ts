import prisma from '../../config/database';
import { NotFoundError } from '../../utils/errors';

export class ScoreService {
  async getCurrentScore(userId: string) {
    const latestScore = await prisma.score.findFirst({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!latestScore) {
      throw new NotFoundError('No score found for user');
    }

    return latestScore;
  }

  async getScoreHistory(userId: string, limit: number = 30) {
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    });

    return scores;
  }

  async calculateScore(userId: string) {
    return {
      totalScore: 0,
      consistencyScore: 0,
      capacityScore: 0,
      integrityScore: 0,
      engagementQualityScore: 0,
      drivers: [],
      nextActions: [],
    };
  }
}
