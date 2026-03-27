import { z } from 'zod';

export const AddCharitySchema = z.object({
  charityId: z.string().uuid({ message: 'Invalid charity ID' }),
  allocation_perc: z.number()
    .int()
    .min(10, { message: 'Minimum allocation is 10%' })
    .max(50, { message: 'Maximum allocation is 50%' }),
});

export const UpdateAllocationSchema = z.object({
  allocation_perc: z.number()
    .int()
    .min(10, { message: 'Minimum allocation is 10%' })
    .max(50, { message: 'Maximum allocation is 50%' }),
});

export type AddCharityInput = z.infer<typeof AddCharitySchema>;
export type UpdateAllocationInput = z.infer<typeof UpdateAllocationSchema>;
