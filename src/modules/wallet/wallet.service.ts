import prisma from '../../config/database';

export class WalletService {
  async getWallet(userId: string) {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        reward: true,
      },
    });

    const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      balance,
      transactions,
    };
  }

  async addPoints(userId: string, amount: number, description: string) {
    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: 'credit',
        amount,
        description,
      },
    });

    return transaction;
  }
}
