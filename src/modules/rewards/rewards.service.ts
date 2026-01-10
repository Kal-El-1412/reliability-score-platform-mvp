import prisma from '../../config/database';
import { ValidationError } from '../../utils/errors';

export class RewardsService {
  async getAvailableRewards() {
    const rewards = await prisma.reward.findMany({
      where: { isAvailable: true },
      orderBy: { pointsCost: 'asc' },
    });

    return rewards;
  }

  async redeemReward(userId: string, rewardId: string) {
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isAvailable) {
      throw new ValidationError('Reward not available');
    }

    const balance = await this.getUserBalance(userId);

    if (balance < reward.pointsCost) {
      throw new ValidationError('Insufficient points');
    }

    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'redemption',
        amount: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`,
        rewardId,
      },
    });

    return { transaction, reward };
  }

  async getUserBalance(userId: string): Promise<number> {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
    });

    const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    return balance;
  }
}
