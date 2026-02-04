import React, { useState } from 'react'
import UserPostForm from '@/components/common/UserPostForm';
import CustomAutocompleteInput from '@/components/form/CustomAutoCompleteInput';
import { adminPostUserListDropDownAction } from '@/constants/api/admin/posts';
import { addUpdatePostSchema } from '@/constants/schema/admin/postSchema';
import { stringToColor } from '@/utils/Utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';

interface AddUpdatePostFormData {
  id: string | null;
  user_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  hero_image: string | null;
  post_images: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  read_time: number | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  published_at: Date | null;
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
  post_images: [],
  status: 'draft',
  is_featured: false,
  read_time: null, //admin
  tags: [],
  seo_title: null, //admin
  seo_description: null, //admin
  published_at: null,
}


const AdminPostForm = () => {
  const [users, setUsers] = useState<any[]>([])

  const methods = useForm<AddUpdatePostFormData>({
    defaultValues,
    resolver: yupResolver(addUpdatePostSchema as any),
  })

  const {
    control,
    reset,
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

  const onSubmit = async(data:AddUpdatePostFormData) => {
    console.log('data: ', data);
    //do nothing
  }

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6">
              Create New Post
            </Typography>
          }
          subheader="Fill out the form below to create a new blog post"
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
            <Grid item xs={12}>
              <UserPostForm />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{display:'flex',alignItems:'center',gap:2,mt:3}}>
                <Button variant='outlined' color='info'>Cancel</Button>
                <Button variant='contained' onClick={handleSubmit(onSubmit)}>Submit</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormProvider>
  )
}

export default AdminPostForm;