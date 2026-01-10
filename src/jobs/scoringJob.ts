import prisma from '../config/database';
import logger from '../config/logger';

export class ScoringJob {
  async calculateScoreForUser(userId: string) {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const events = await prisma.event.findMany({
        where: {
          userId,
          timestamp: {
            gte: ninetyDaysAgo,
          },
        },
        orderBy: { timestamp: 'desc' },
      });

      const features = await this.computeFeatures(userId, events);

      const consistencyScore = this.calculateConsistencyScore(features);
      const capacityScore = this.calculateCapacityScore(features);
      const integrityScore = await this.calculateIntegrityScore(userId, features);
      const engagementQualityScore = this.calculateEngagementQualityScore(features);

      const totalScore = consistencyScore + capacityScore + integrityScore + engagementQualityScore;

      const drivers = this.generateDrivers(features);
      const nextActions = this.generateNextActions(features);

      const score = await prisma.score.create({
        data: {
          userId,
          totalScore,
          consistencyScore,
          capacityScore,
          integrityScore,
          engagementQualityScore,
          drivers,
          nextActions,
        },
      });

      logger.info(`Score calculated for user ${userId}: ${totalScore}`);

      return score;
    } catch (error) {
      logger.error(`Error calculating score for user ${userId}:`, error);
      throw error;
    }
  }

  async runForAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: { id: true },
      });

      logger.info(`Starting daily scoring for ${users.length} users`);

      for (const user of users) {
        await this.calculateScoreForUser(user.id);
      }

      logger.info('Daily scoring completed');
    } catch (error) {
      logger.error('Error in daily scoring job:', error);
    }
  }

  private async computeFeatures(userId: string, events: any[]) {
    const activityDays = new Set(events.map(e => e.timestamp.toDateString())).size;
    const totalEvents = events.length;
    const avgEventsPerDay = activityDays > 0 ? totalEvents / activityDays : 0;

    const eventTypes = new Set(events.map(e => e.eventType));
    const eventDiversity = eventTypes.size / Math.max(totalEvents, 1);

    const streaks = this.calculateStreaks(events);

    const features = {
      activityDays,
      streakCurrent: streaks.current,
      streakLongest: streaks.longest,
      eventDiversity,
      totalEvents,
      avgEventsPerDay,
      lastActivityDate: events.length > 0 ? events[0].timestamp : null,
    };

    await prisma.feature.upsert({
      where: { userId },
      update: { ...features, calculatedAt: new Date() },
      create: { userId, ...features },
    });

    return features;
  }

  private calculateStreaks(events: any[]) {
    let current = 0;
    let longest = 0;
    let lastDate: Date | null = null;

    for (const event of events) {
      if (!lastDate) {
        current = 1;
        lastDate = event.timestamp;
      } else {
        const dayDiff = Math.floor(
          (lastDate.getTime() - event.timestamp.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          current++;
        } else if (dayDiff > 1) {
          longest = Math.max(longest, current);
          current = 1;
        }

        lastDate = event.timestamp;
      }
    }

    longest = Math.max(longest, current);

    return { current, longest };
  }

  private calculateConsistencyScore(features: any): number {
    const streakScore = Math.min(features.streakCurrent * 10, 150);
    const activityScore = Math.min(features.activityDays * 2, 150);
    return Math.min(streakScore + activityScore, 300);
  }

  private calculateCapacityScore(features: any): number {
    const eventScore = Math.min(features.totalEvents * 0.5, 150);
    const avgScore = Math.min(features.avgEventsPerDay * 20, 100);
    return Math.min(eventScore + avgScore, 250);
  }

  private async calculateIntegrityScore(userId: string, features: any): Promise<number> {
    const riskProfile = await prisma.riskProfile.findUnique({
      where: { userId },
    });

    let baseScore = 250;

    if (riskProfile) {
      const flags = Array.isArray(riskProfile.flags) ? riskProfile.flags : [];
      baseScore -= flags.length * 50;

      if (riskProfile.riskState === 'watch') baseScore -= 50;
      if (riskProfile.riskState === 'shadow') baseScore -= 100;
    }

    return Math.max(baseScore, 0);
  }

  private calculateEngagementQualityScore(features: any): number {
    const diversityScore = Math.min(features.eventDiversity * 100, 100);
    const qualityScore = Math.min(features.avgEventsPerDay * 10, 100);
    return Math.min(diversityScore + qualityScore, 200);
  }

  private generateDrivers(features: any): any {
    const drivers = [];

    if (features.streakCurrent > 7) {
      drivers.push({
        factor: 'Consistent Activity',
        impact: 'positive',
        description: `${features.streakCurrent} day streak`,
      });
    }

    if (features.eventDiversity > 0.7) {
      drivers.push({
        factor: 'High Diversity',
        impact: 'positive',
        description: 'Engaging with multiple event types',
      });
    }

    if (features.avgEventsPerDay < 1) {
      drivers.push({
        factor: 'Low Activity',
        impact: 'negative',
        description: 'Less than 1 event per day',
      });
    }

    return drivers;
  }

  private generateNextActions(features: any): any {
    const actions = [];

    if (features.streakCurrent < 3) {
      actions.push('Build a daily activity streak');
    }

    if (features.eventDiversity < 0.5) {
      actions.push('Try different types of activities');
    }

    if (features.avgEventsPerDay < 2) {
      actions.push('Increase daily engagement');
    }

    return actions.length > 0 ? actions : ['Keep up the great work!'];
  }
}

export const scoringJob = new ScoringJob();
