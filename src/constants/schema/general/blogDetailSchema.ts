import * as yup from 'yup'

export const blogRateReviewSchema = yup.object().shape({
  post_id:yup.string().required(),
  review: yup.string().required('Review cannot be empty'),
  rating: yup.number().required('Rating is required').min(0.5, 'Minimum rating is 0.5').max(5, 'Maximum rating is 5')
})
