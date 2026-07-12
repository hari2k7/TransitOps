import { z } from 'zod'

export const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, 'Registration number is required.'),
  name: z.string().trim().min(1, 'Vehicle name is required.'),
  type: z.enum(['Van', 'Truck', 'Mini Truck'], {
    errorMap: () => ({ message: 'Select a vehicle type.' }),
  }),
  capacity: z.coerce
    .number({ invalid_type_error: 'Capacity must be a number.' })
    .positive('Capacity must be greater than 0.'),
  odometer: z.coerce
    .number({ invalid_type_error: 'Odometer must be a number.' })
    .min(0, 'Odometer cannot be negative.'),
  acquisitionCost: z.coerce
    .number({ invalid_type_error: 'Acquisition cost must be a number.' })
    .positive('Acquisition cost must be greater than 0.'),
  region: z.enum(['North', 'South', 'East', 'West'], {
    errorMap: () => ({ message: 'Select a region.' }),
  }),
  status: z.enum(['Available', 'On Trip', 'In Shop', 'Retired'], {
    errorMap: () => ({ message: 'Select a status.' }),
  }),
})
