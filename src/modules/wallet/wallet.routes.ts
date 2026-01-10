import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const walletController = new WalletController();

router.get('/', authenticate, walletController.getWallet);

export default router;
