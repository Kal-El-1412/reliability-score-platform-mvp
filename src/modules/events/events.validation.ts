import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    eventType: z.string().min(1, 'Event type is required'),
    eventData: z.record(z.any()),
    metadata: z.record(z.any()).optional(),
  }),
});
