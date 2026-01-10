import { z } from 'zod';

export const completeMissionSchema = z.object({
  body: z.object({
    missionId: z.string().uuid('Invalid mission ID'),
  }),
});
