import { Response, NextFunction } from 'express';
import { RewardsService } from './rewards.service';
import { AuthRequest } from '../../middleware/auth';

const rewardsService = new RewardsService();

export class RewardsController {
  async getAvailableRewards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rewards = await rewardsService.getAvailableRewards();

      res.status(200).json({
        status: 'success',
        data: { rewards },
      });
    } catch (error) {
      next(error);
    }
  }

  async redeemReward(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { rewardId } = req.body;
      const result = await rewardsService.redeemReward(req.userId!, rewardId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
