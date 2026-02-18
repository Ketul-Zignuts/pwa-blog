import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { postDetailMorePostGetAction } from '@/constants/api/general/general'
import { BlogDetailProps } from '@/types/blogTypes'
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Chip,
    useTheme
} from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import dayjs from 'dayjs'
import { getRandomMuiColor } from '@/utils/Utils'

type BlogMorePostProps = {
    blog: BlogDetailProps
}

const BlogMorePost = ({ blog }: BlogMorePostProps) => {
    const post_id = blog?.id
    const author_id = blog?.user?.uid
    const theme = useTheme();

    const { data, isLoading } = useQuery({
        queryKey: ['more-post-by-author', post_id, author_id],
        queryFn: () =>
            postDetailMorePostGetAction({
                post_id,
                author_id,
            }),
        enabled: !!post_id && !!author_id,
    })

    const posts = data?.data || []

    if (isLoading) return null

    return (
        <Box component="div" mt={3}>
            <Typography variant="h4" mb={3}>
                More from this author
            </Typography>

            <Box sx={{ position: 'relative' }}>
                <Swiper
                    modules={[Autoplay, FreeMode, Pagination]}
                    freeMode
                    loop
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{
                        el: '.custom-swiper-pagination',
                        clickable: true,
                    }}
                    breakpoints={{
                        600: { slidesPerView: 2 },
                        960: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    autoplay={{
                        delay: 200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={2000}
                    grabCursor
                >
                    {posts.map((post: any) => (
                        <SwiperSlide key={post.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 1,
                                }}
                            >
                                <CardActionArea>
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${post?.hero_image}`}
                                            alt={post.title}
                                        />
                                        <Chip
                                            variant="tonal"
                                            size="small"
                                            color={getRandomMuiColor()}
                                            label={post?.category?.name}
                                            sx={{ position: 'absolute', top: 5, right: 5 }}
                                        />
                                    </Box>

                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            mt={1}
                                        >
                                            {dayjs(post.published_at).format('DD MMM YYYY')} •{' '}
                                            {post.read_time} min read
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box
                    className="custom-swiper-pagination"
                    sx={{
                        mt: 3,
                        textAlign: 'center',

                        '& .swiper-pagination-bullet': {
                            backgroundColor: theme.palette.secondary.main,
                            opacity: 1,
                            width: 10,
                            height: 10,
                        },

                        '& .swiper-pagination-bullet-active': {
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                />
            </Box>
        </Box>
    )
}

export default BlogMorePost
