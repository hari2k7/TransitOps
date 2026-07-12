import { z } from 'zod'

export const driverSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  licenseNumber: z.string().trim().min(1, 'License number is required.'),
  licenseCategory: z.enum(['LMV', 'HMV'], {
    errorMap: () => ({ message: 'Select a license category.' }),
  }),
  licenseExpiry: z.string().min(1, 'License expiry date is required.'),
  contactNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Contact number must be exactly 10 digits.'),
  safetyScore: z.coerce
    .number({ invalid_type_error: 'Safety score must be a number.' })
    .min(0, 'Safety score cannot be negative.')
    .max(100, 'Safety score cannot exceed 100.'),
  status: z.enum(['Available', 'On Trip', 'Off Duty', 'Suspended'], {
    errorMap: () => ({ message: 'Select a status.' }),
  }),
})
