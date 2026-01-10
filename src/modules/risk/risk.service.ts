import prisma from '../../config/database';

export class RiskService {
  async getRiskProfile(userId: string) {
    let riskProfile = await prisma.riskProfile.findUnique({
      where: { userId },
    });

    if (!riskProfile) {
      riskProfile = await prisma.riskProfile.create({
        data: {
          userId,
          riskState: 'ok',
          flags: [],
          velocityScore: 0,
        },
      });
    }

    return riskProfile;
  }

  async flagUser(userId: string, flagType: string, reason: string) {
    const riskProfile = await this.getRiskProfile(userId);

    const flags = Array.isArray(riskProfile.flags) ? riskProfile.flags : [];
    const newFlags = [
      ...flags,
      {
        type: flagType,
        reason,
        timestamp: new Date().toISOString(),
      },
    ];

    const updatedProfile = await prisma.riskProfile.update({
      where: { userId },
      data: {
        flags: newFlags,
        riskState: this.calculateRiskState(newFlags.length),
        lastFlaggedAt: new Date(),
      },
    });

    return updatedProfile;
  }

  private calculateRiskState(flagCount: number): string {
    if (flagCount === 0) return 'ok';
    if (flagCount <= 2) return 'watch';
    return 'shadow';
  }

  async checkVelocity(userId: string, timeWindowMs: number = 3600000) {
    const recentEvents = await prisma.event.findMany({
      where: {
        userId,
        timestamp: {
          gte: new Date(Date.now() - timeWindowMs),
        },
      },
    });

    const velocityScore = recentEvents.length / (timeWindowMs / 1000);

    return velocityScore;
  }
}
