import React from 'react'
import Rating from '@mui/material/Rating'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../form/CustomTextInput'
import { Button, Box, Card, CardContent, CardActions, CircularProgress } from '@mui/material'
import { blogRateReviewSchema } from '@/constants/schema/general/blogDetailSchema'
import { BlogDetailProps } from '@/types/blogTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rateReviewCreateAction } from '@/constants/api/general/general'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store'

type FormValues = {
    rating: number
    review: string
}

type BlogReviewFormProps = {
    blog: BlogDetailProps
}

const BlogReviewForm = ({ blog }: BlogReviewFormProps) => {
    const post_id = blog?.id;
    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useAppSelector((state)=>state.auth.user);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: yupResolver(blogRateReviewSchema),
        mode: 'all',
        defaultValues: {
            rating: 1,
            review: ''
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => {
            const apiCall = rateReviewCreateAction;
            return apiCall({ ...data, post_id });
        },
        onSuccess: () => {
            toast.success('Review submitted successfully!');
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Something went wrong!';
            toast.error(message);
        },
        onSettled: () => {
            reset()
            queryClient.invalidateQueries({ queryKey: ['blog-reviews', blog?.id] });
        }
    });

    const onSubmit = async (data: any) => {
        if(!user) {
            toast.info('Please log in to rate and review this post.')
            return router.push('/login')
        }
        await mutate(data);
    };

    return (
        <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
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
                                sx={{
                                    color: 'primary.main'
                                }}
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
                    <Button type='submit' variant='contained' color='primary' disabled={isPending} startIcon={isPending ? <CircularProgress size={20} color='warning' /> : null}>
                        Submit Review
                    </Button>
                </CardActions>
            </Box>
        </Card>

    )
}

export default BlogReviewForm
