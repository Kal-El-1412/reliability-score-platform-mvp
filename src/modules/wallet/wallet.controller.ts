import { Response, NextFunction } from 'express';
import { WalletService } from './wallet.service';
import { AuthRequest } from '../../middleware/auth';

const walletService = new WalletService();

export class WalletController {
  async getWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wallet = await walletService.getWallet(req.userId!);

      res.status(200).json({
        status: 'success',
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  }
}
