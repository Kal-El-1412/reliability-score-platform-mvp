import prisma from '../config/database';
import logger from '../config/logger';

export class MissionAssignmentJob {
  async assignDailyMissions() {
    try {
      logger.info('Starting daily mission assignment');

      const users = await prisma.user.findMany({
        select: { id: true },
      });

      const dailyMissions = await prisma.mission.findMany({
        where: {
          frequency: 'daily',
          isActive: true,
        },
      });

      for (const user of users) {
        for (const mission of dailyMissions) {
          const existingAssignment = await prisma.userMission.findFirst({
            where: {
              userId: user.id,
              missionId: mission.id,
              status: 'active',
            },
          });

          if (!existingAssignment) {
            await prisma.userMission.create({
              data: {
                userId: user.id,
                missionId: mission.id,
                status: 'active',
                expiresAt: this.getExpiryDate('daily'),
              },
            });

            logger.info(`Assigned daily mission ${mission.name} to user ${user.id}`);
          }
        }
      }

      logger.info('Daily mission assignment completed');
    } catch (error) {
      logger.error('Error in daily mission assignment:', error);
    }
  }

  async assignWeeklyMissions() {
    try {
      logger.info('Starting weekly mission assignment');

      const users = await prisma.user.findMany({
        select: { id: true },
      });

      const weeklyMissions = await prisma.mission.findMany({
        where: {
          frequency: 'weekly',
          isActive: true,
        },
      });

      for (const user of users) {
        for (const mission of weeklyMissions) {
          const existingAssignment = await prisma.userMission.findFirst({
            where: {
              userId: user.id,
              missionId: mission.id,
              status: 'active',
            },
          });

          if (!existingAssignment) {
            await prisma.userMission.create({
              data: {
                userId: user.id,
                missionId: mission.id,
                status: 'active',
                expiresAt: this.getExpiryDate('weekly'),
              },
            });

            logger.info(`Assigned weekly mission ${mission.name} to user ${user.id}`);
          }
        }
      }

      logger.info('Weekly mission assignment completed');
    } catch (error) {
      logger.error('Error in weekly mission assignment:', error);
    }
  }

  async expireOldMissions() {
    try {
      const expiredMissions = await prisma.userMission.updateMany({
        where: {
          status: 'active',
          expiresAt: {
            lt: new Date(),
          },
        },
        data: {
          status: 'expired',
        },
      });

      logger.info(`Expired ${expiredMissions.count} old missions`);
    } catch (error) {
      logger.error('Error expiring old missions:', error);
    }
  }

  private getExpiryDate(frequency: string): Date {
    const now = new Date();
    if (frequency === 'daily') {
      now.setDate(now.getDate() + 1);
      now.setHours(23, 59, 59, 999);
    } else if (frequency === 'weekly') {
      now.setDate(now.getDate() + 7);
      now.setHours(23, 59, 59, 999);
    }
    return now;
  }
}

export const missionAssignmentJob = new MissionAssignmentJob();
