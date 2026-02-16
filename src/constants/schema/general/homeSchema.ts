import * as yup from 'yup'

export const commentPostSchema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .required('Comment cannot be empty')
    .min(2, 'Comment is too short')
    .max(1000, 'Comment is too long')
})
