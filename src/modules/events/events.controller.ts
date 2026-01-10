import { Response, NextFunction } from 'express';
import { EventsService } from './events.service';
import { AuthRequest } from '../../middleware/auth';

const eventsService = new EventsService();

export class EventsController {
  async createEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventType, eventData, metadata } = req.body;
      const event = await eventsService.createEvent(req.userId!, {
        eventType,
        eventData,
        metadata,
      });

      res.status(201).json({
        status: 'success',
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }
}
