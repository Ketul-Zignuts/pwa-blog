import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  type: yup
    .string()
    .oneOf(['admin', 'user'], 'Type must be admin or user')
    .optional()
})

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
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
  bio: yup.string().max(160, 'Bio must be less than 160 characters').nullable(),
  photoURL: yup
    .mixed<File>()
    .nullable()
    .notRequired()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value || !(value instanceof File)) return true
      return value.size <= 5 * 1024 * 1024 // 5MB
    })
    .test('fileType', 'Only PNG, JPG, WebP images are allowed', (value) => {
      if (!value || !(value instanceof File)) return true
      return ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(value.type)
    })
});