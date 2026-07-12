import { z } from 'zod'

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle.'),
  type: z.enum(['Routine Service', 'Repair', 'Inspection', 'Tire Change'], {
    errorMap: () => ({ message: 'Select a maintenance type.' }),
  }),
  scheduledDate: z.string().min(1, 'Scheduled date is required.'),
  cost: z.coerce
    .number({ invalid_type_error: 'Cost must be a number.' })
    .nonnegative('Cost cannot be negative.'),
  notes: z.string().trim().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled'], {
    errorMap: () => ({ message: 'Select a status.' }),
  }),
})
