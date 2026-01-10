import { Request, Response, NextFunction } from 'express';
import { RiskService } from './risk.service';

const riskService = new RiskService();

export class RiskController {
  async getRiskProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const profile = await riskService.getRiskProfile(userId);

      res.status(200).json({
        status: 'success',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }

  async flagUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, flagType, reason } = req.body;
      const profile = await riskService.flagUser(userId, flagType, reason);

      res.status(200).json({
        status: 'success',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }
}
