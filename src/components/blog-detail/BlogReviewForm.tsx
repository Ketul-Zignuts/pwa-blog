import React, { useEffect } from 'react'
import Rating from '@mui/material/Rating'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../form/CustomTextInput'
import { Button, Box, Card, CardContent, CardActions } from '@mui/material'
import { blogRateReviewSchema } from '@/constants/schema/general/blogDetailSchema'
import { BlogDetailProps } from '@/types/blogTypes'

type FormValues = {
    post_id:string
    rating: number
    review: string
}

type BlogReviewFormProps = {
  blog: BlogDetailProps
}

const BlogReviewForm = ({ blog }: BlogReviewFormProps) => {
    const post_id = blog?.id;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: yupResolver(blogRateReviewSchema),
        mode: 'all',
        defaultValues: {
            post_id:'',
            rating: 1,
            review: ''
        }
    })

    const onSubmit = (data: FormValues) => {
        console.log('Form submitted:', data)
        // send data to API
    }

    useEffect(() => {
      if(post_id){
        setValue('post_id',post_id)
      }
    }, [post_id])
    

    return (
        <Card>
            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                <CardContent className='space-y-4'>
                    <Controller
                        name='rating'
                        control={control}
                        render={({ field }) => (
                            <Rating
                                {...field}
                                precision={0.5}
                                onChange={(_, value) => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.rating && (
                        <Box color='error.main' fontSize={12}>
                            {errors.rating.message}
                        </Box>
                    )}

                    <CustomTextInput
                        control={control as any}
                        variant='outlined'
                        rules={{}}
                        errors={errors}
                        id='review'
                        name='review'
                        placeholder='Write a review'
                        label='Write a review'
                        multiline
                        rows={4}
                        type='text'
                    />
                </CardContent>

                <CardActions>
                    <Button type='submit' variant='contained' color='primary'>
                        Submit Review
                    </Button>
                </CardActions>
            </Box>
        </Card>

    )
}

export default BlogReviewForm
