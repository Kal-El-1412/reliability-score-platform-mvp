import { Response, NextFunction } from 'express';
import { ScoreService } from './score.service';
import { AuthRequest } from '../../middleware/auth';

const scoreService = new ScoreService();

export class ScoreController {
  async getCurrentScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const score = await scoreService.getCurrentScore(req.userId!);

      res.status(200).json({
        status: 'success',
        data: { score },
      });
    } catch (error) {
      next(error);
    }
  }

  async getScoreHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const history = await scoreService.getScoreHistory(req.userId!, limit);

      res.status(200).json({
        status: 'success',
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  }
}
