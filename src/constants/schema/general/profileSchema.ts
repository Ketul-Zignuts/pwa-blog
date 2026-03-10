import * as yup from 'yup'

export const profileUpdateSchema = yup.object().shape({
  bio: yup.string().max(160, 'Bio must be less than 160 characters').nullable(),
  displayName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .required('Full name is required'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .nullable()
    .notRequired(),
})

export const changePasswordSchema = yup.object().shape({
  provider: yup.string(),
  currentPassword: yup.string().when('provider', {
    is: (val: string) => val === 'email',
    then: (schema) => schema.required('Current password is required'),
    otherwise: (schema) => schema.notRequired()
  }),

  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .notOneOf(
      [yup.ref('currentPassword')],
      'New password cannot be same as old password'
    )
    .required('New password is required'),

  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('newPassword')],
      'Passwords must match'
    )
    .required('Please confirm your password')
})