import prisma from '../../config/database';
import logger from '../../config/logger';

export class EventsService {
  async createEvent(
    userId: string,
    data: {
      eventType: string;
      eventData: any;
      metadata?: any;
    }
  ) {
    const event = await prisma.event.create({
      data: {
        userId,
        eventType: data.eventType,
        eventData: data.eventData,
        metadata: data.metadata,
      },
    });

    logger.info(`Event created: ${event.id} for user ${userId}`);

    return event;
  }

  async getEventsByUser(userId: string, limit: number = 100) {
    const events = await prisma.event.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return events;
  }

  async getEventsByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const events = await prisma.event.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return events;
  }
}
