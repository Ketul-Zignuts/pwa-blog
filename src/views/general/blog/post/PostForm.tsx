'use client'
import React, { useEffect } from 'react'
import UserPostForm from '@/components/common/UserPostForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Divider, Grid, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { PostDetailDataType } from '@/types/postTypes';
import AppBreadcrumbs from '@/components/common/AppBreadcrumbs';
import HomeNavbar from '@/components/navbar/HomeNavbar';
import { userPostSchema } from '@/constants/schema/general/userPostSchema';
import UserProfileHeader from '@/components/user-profile/UserProfileHeader';
import { calculateReadTime } from '@/utils/Utils';
import { userPostCreateAction, userPostUpdateAction } from '@/constants/api/post';

interface AddUpdatePostFormData {
    id: string | null;
    category_id: string | null;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    hero_image: string | null;
    status: 'draft' | 'published' | 'archived';
    read_time: number | null;
    tags: string[];
    published_at: Date | string | null;
}

const defaultValues: AddUpdatePostFormData = {
    id: null,
    category_id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: null,
    hero_image: null,
    status: 'draft',
    read_time: null,
    tags: [],
    published_at: dayjs().toDate(),
}

type PostFormTypeProps = {
    data?: PostDetailDataType
    fromEdit?: boolean
}


const PostForm = ({ data, fromEdit }: PostFormTypeProps) => {
    const router = useRouter();

    const path = [
        { label: 'Home', href: '/home' },
        { label: `${fromEdit ? 'Update' : 'Create'} Posts` }
    ]

    const methods = useForm<AddUpdatePostFormData>({
        defaultValues,
        resolver: yupResolver(userPostSchema as any),
    })

    const {
        control,
        reset,
        watch,
        handleSubmit,
        setValue,
        formState: { errors }
    } = methods

    const { mutate, isPending } = useMutation({
        mutationFn: (data: AddUpdatePostFormData) => {
            const apiCall = data?.id ? userPostUpdateAction : userPostCreateAction;
            return apiCall(data);
        },
        onSuccess: () => {
            router.push('/home')
            toast.success(`Post ${data?.id ? 'updated' : 'created'} successfully!`);
            router.push('/user/profile?tab=my-posts')
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || 'Something went wrong!';
            toast.error(message);
        }
    });

    const onSubmit = async (data: any) => {
        const payload = {
            ...data,
            read_time:calculateReadTime(data?.content)
        }
        await mutate(payload);
    };

    useEffect(() => {
        methods?.reset({
            id: data?.id,
            category_id: data?.category_id,
            title: data?.title,
            slug: data?.slug,
            content: data?.content,
            excerpt: data?.excerpt || null,
            hero_image: null,
            status: data?.status || 'draft',
            read_time: data?.read_time || null,
            tags: Array.isArray(data?.tags) && data?.tags?.length > 0 ? data.tags.map((item: string) => ({ value: item })) as any[] : [],
            published_at: data?.published_at ? dayjs(data?.published_at).toDate() : dayjs().toDate(),
        })
    }, [data])

    return (
        <>
            <HomeNavbar />
            <Container maxWidth="lg" sx={{ mb: 10,mt:3 }}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <AppBreadcrumbs path={path} />
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 5 }} >
                        <UserProfileHeader fromUser={true} editable={false} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormProvider {...methods}>
                            <Card>
                                <CardHeader
                                    title={
                                        <Typography variant="h6">
                                            {fromEdit ? 'Update Post' : 'Create New Post'}
                                        </Typography>
                                    }
                                    subheader={`Fill out the form below to ${fromEdit ? 'update' : 'create a new'} blog post`}
                                />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <UserPostForm data={data} fromUser={true} />
                                        </Grid>
                                        <Divider sx={{ height: 2, width: '100%', my: 5 }} />
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                                                <Button variant='outlined' color='info' onClick={() => router.back()}>Cancel</Button>
                                                <Button variant='contained' type='button' disabled={isPending} onClick={handleSubmit(onSubmit)} startIcon={isPending ? <CircularProgress size={20} color='warning' /> : null}>
                                                    Submit
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </FormProvider>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default PostForm;