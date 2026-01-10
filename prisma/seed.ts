import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const missions = await prisma.mission.createMany({
    data: [
      {
        name: 'Daily Login',
        description: 'Log in to the platform',
        type: 'login',
        frequency: 'daily',
        requirements: { minLogins: 1 },
        scoreBonus: 10,
        rewardPoints: 5,
        isActive: true,
      },
      {
        name: 'Complete 5 Events',
        description: 'Complete 5 events today',
        type: 'events',
        frequency: 'daily',
        requirements: { minEvents: 5 },
        scoreBonus: 20,
        rewardPoints: 10,
        isActive: true,
      },
      {
        name: 'Weekly Streak',
        description: 'Maintain a 7-day streak',
        type: 'streak',
        frequency: 'weekly',
        requirements: { minStreak: 7 },
        scoreBonus: 50,
        rewardPoints: 25,
        isActive: true,
      },
      {
        name: 'Event Diversity',
        description: 'Complete 3 different types of events',
        type: 'diversity',
        frequency: 'daily',
        requirements: { minTypes: 3 },
        scoreBonus: 15,
        rewardPoints: 8,
        isActive: true,
      },
      {
        name: 'Weekly Champion',
        description: 'Complete 50 events in a week',
        type: 'volume',
        frequency: 'weekly',
        requirements: { minEvents: 50 },
        scoreBonus: 100,
        rewardPoints: 50,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${missions.count} missions`);

  const rewards = await prisma.reward.createMany({
    data: [
      {
        name: '$5 Gift Card',
        description: 'Redeem for a $5 gift card',
        category: 'gift_card',
        pointsCost: 100,
        isAvailable: true,
        metadata: { value: 5, currency: 'USD' },
      },
      {
        name: '$10 Gift Card',
        description: 'Redeem for a $10 gift card',
        category: 'gift_card',
        pointsCost: 200,
        isAvailable: true,
        metadata: { value: 10, currency: 'USD' },
      },
      {
        name: '$25 Gift Card',
        description: 'Redeem for a $25 gift card',
        category: 'gift_card',
        pointsCost: 500,
        isAvailable: true,
        metadata: { value: 25, currency: 'USD' },
      },
      {
        name: 'Premium Badge',
        description: 'Get a premium badge on your profile',
        category: 'badge',
        pointsCost: 50,
        isAvailable: true,
        metadata: { type: 'premium' },
      },
      {
        name: 'Score Boost',
        description: 'Get a 50-point score boost',
        category: 'boost',
        pointsCost: 75,
        isAvailable: true,
        metadata: { boost: 50 },
      },
      {
        name: 'VIP Access',
        description: '1 month of VIP access',
        category: 'access',
        pointsCost: 300,
        isAvailable: true,
        metadata: { duration: 30, type: 'vip' },
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${rewards.count} rewards`);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
