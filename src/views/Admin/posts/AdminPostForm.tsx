import React, { useEffect, useState } from 'react'
import UserPostForm from '@/components/common/UserPostForm';
import CustomAutocompleteInput from '@/components/form/CustomAutoCompleteInput';
import { adminPostCreateAction, adminPostUpdateAction, adminPostUserListDropDownAction } from '@/constants/api/admin/posts';
import { addUpdatePostSchema } from '@/constants/schema/admin/postSchema';
import { stringToColor } from '@/utils/Utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import CustomTextInput from '@/components/form/CustomTextInput';
import CustomSwitch from '@/components/form/CustomSwitch';
import dayjs from 'dayjs';
import { useAppSelector } from '@/store';
import { toast } from 'react-toastify';
import { globalConfig } from '@/configs/globalConfig';
import { useRouter } from 'next/navigation';
import { PostDetailDataType } from '@/types/postTypes';

interface AddUpdatePostFormData {
  id: string | null;
  user_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  hero_image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  read_time: number | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  published_at: Date | string | null;
}

const defaultValues: AddUpdatePostFormData = {
  id: null,
  user_id: '',
  category_id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: null,
  hero_image: null,
  status: 'draft',
  is_featured: false,
  read_time: null,
  tags: [],
  seo_title: null,
  seo_description: null,
  published_at: dayjs().toDate(),
}

type AdminPostFormTypeProps = {
  data: PostDetailDataType
}


const AdminPostForm = ({ data }: AdminPostFormTypeProps) => {
  const [users, setUsers] = useState<any[]>([])
  const isRoAdmin = useAppSelector((state) => state?.auth?.user?.isroadmin)
  const queryClient = useQueryClient()
  const router = useRouter();

  const methods = useForm<AddUpdatePostFormData>({
    defaultValues,
    resolver: yupResolver(addUpdatePostSchema as any),
  })

  const {
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods

  const userSearchMutation = useMutation({
    mutationFn: (search: string) => adminPostUserListDropDownAction({ search }),
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        setUsers(res)
      }
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddUpdatePostFormData) => {
      const apiCall = data?.id ? adminPostUpdateAction : adminPostCreateAction;
      return apiCall(data);
    },
    onSuccess: () => {
      router.push('/admin/posts')
      toast.success(`Post ${data?.id ? 'updated' : 'created'} successfully!`);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Something went wrong!';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    }
  });

  const onSubmit = async (data: any) => {
    // if (isRoAdmin) {
    //   toast.error(globalConfig?.RO_ADMIN_MESSAGE)
    //   return
    // }
    await mutate(data);
  };

  useEffect(() => {
    methods?.reset({
      id: data?.id,
      user_id: data?.user_id,
      category_id: data?.category_id,
      title: data?.title,
      slug: data?.slug,
      content: data?.content,
      excerpt: data?.excerpt || null,
      hero_image: null,
      status: data?.status || 'draft',
      is_featured: data?.is_featured || false,
      read_time: data?.read_time || null,
      tags: Array.isArray(data?.tags) && data?.tags?.length > 0 ? data.tags.map((item: string) => ({ value: item })) as any[] : [],
      seo_title: data?.seo_title || null,
      seo_description: data?.seo_description || null,
      published_at: data?.published_at ? dayjs(data?.published_at).toDate() : dayjs().toDate(),
    })
  }, [data])

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6">
              {data?.id ? 'Update Post' : 'Create New Post'}
            </Typography>
          }
          subheader={`Fill out the form below to ${data?.id ? 'update' : 'create a new'} blog post`}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomAutocompleteInput
                name="user_id"
                label="Start typing to search..."
                control={control}
                options={users}
                onSearch={(q) => {
                  if (q.trim()) userSearchMutation.mutate(q)
                  if (q === '') userSearchMutation.mutate('')
                }}
                errors={errors}
                labelPlaceHolder='Author Name'
                renderOption={(user) => (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar src={user?.avatar} sx={{ width: 36, height: 36, bgcolor: stringToColor(user?.label || user?.email || 'user') }} />
                    <Box>
                      <Typography fontWeight={500}>{user.label}</Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                control={control as any}
                variant='outlined'
                rules={{}}
                errors={errors}
                id='seo_title'
                name='seo_title'
                placeholder='Seo Title'
                label='Seo Title'
                type='text'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                control={control as any}
                variant='outlined'
                rules={{}}
                errors={errors}
                id='seo_description'
                name='seo_description'
                placeholder='Seo Descriptions'
                label='Seo Descriptions'
                type='text'
              />
            </Grid>
            <Grid item xs={12}>
              <UserPostForm data={data} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                control={control as any}
                variant='outlined'
                rules={{}}
                errors={errors}
                id='read_time'
                name='read_time'
                placeholder='Read Time'
                type='number'
              />
            </Grid>
            <Divider sx={{ height: 2, width: '100%', my: 5 }} />
            <Grid item xs={12} sm={6}>
              <CustomSwitch
                name="is_featured"
                label="Featured"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant='outlined' color='info' onClick={() => router.push('/admin/posts')}>Cancel</Button>
                <Button variant='contained' type='button' disabled={isPending} onClick={handleSubmit(onSubmit)} startIcon={isPending ? <CircularProgress size={20} color='warning' /> : null}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormProvider>
  )
}

export default AdminPostForm;