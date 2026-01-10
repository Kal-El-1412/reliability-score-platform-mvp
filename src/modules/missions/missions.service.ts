import prisma from '../../config/database';

export class MissionsService {
  async getActiveMissions(userId: string) {
    const userMissions = await prisma.userMission.findMany({
      where: {
        userId,
        status: 'active',
      },
      include: {
        mission: true,
      },
    });

    return userMissions;
  }

  async completeMission(userId: string, missionId: string) {
    const userMission = await prisma.userMission.findFirst({
      where: {
        userId,
        missionId,
        status: 'active',
      },
      include: {
        mission: true,
      },
    });

    if (!userMission) {
      throw new Error('Mission not found or already completed');
    }

    const updatedMission = await prisma.userMission.update({
      where: { id: userMission.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
      include: {
        mission: true,
      },
    });

    return updatedMission;
  }

  async assignMission(userId: string, missionId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    const userMission = await prisma.userMission.create({
      data: {
        userId,
        missionId,
        status: 'active',
      },
      include: {
        mission: true,
      },
    });

    return userMission;
  }
}
