import { Response, NextFunction } from 'express';
import { MissionsService } from './missions.service';
import { AuthRequest } from '../../middleware/auth';

const missionsService = new MissionsService();

export class MissionsController {
  async getActiveMissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const missions = await missionsService.getActiveMissions(req.userId!);

      res.status(200).json({
        status: 'success',
        data: { missions },
      });
    } catch (error) {
      next(error);
    }
  }

  async completeMission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { missionId } = req.body;
      const mission = await missionsService.completeMission(req.userId!, missionId);

      res.status(200).json({
        status: 'success',
        data: { mission },
      });
    } catch (error) {
      next(error);
    }
  }
}
