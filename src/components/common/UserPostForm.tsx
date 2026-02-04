import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import CustomAutocompleteInput from '../form/CustomAutoCompleteInput';
import { useMutation } from '@tanstack/react-query';
import { adminPostCategoryListDropDownAction } from '@/constants/api/admin/categories';
import { slugGetAction } from '@/constants/api/slug';
import CustomTextInput from '../form/CustomTextInput';
import CustomTextEditor from '../form/CustomTextEditor';
import CustomDropzoneInput from '../form/CustomDropzoneInput';

const UserPostForm = () => {
    const [categoryList, setCategoryList] = useState<any[]>([])
    const { control, watch, setValue, trigger, formState: { errors } } = useFormContext();

    const categorySearchMutation = useMutation({
        mutationFn: (search: string) => adminPostCategoryListDropDownAction({ search }),
        onSuccess: (res) => {
            if (Array.isArray(res)) {
                setCategoryList(res)
            }
        }
    })

    const getSlugMutation = useMutation({
        mutationFn: ({ name }: { name: string }) => slugGetAction({ name }),
        onSuccess: (slugRes) => {
            setValue('slug', slugRes.slug, { shouldValidate: true })
        }
    })

    useEffect(() => {
        categorySearchMutation.mutateAsync('')
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <CustomAutocompleteInput
                    name="category_id"
                    label="Start typing to search..."
                    control={control}
                    options={categoryList}
                    onSearch={(q) => {
                        if (q.trim()) categorySearchMutation.mutate(q)
                        if (q === '') categorySearchMutation.mutate('')
                    }}
                    errors={errors}
                    labelPlaceHolder='Select Category'
                />
            </Grid>
            <Grid item xs={6}>
                <CustomTextInput
                    control={control as any}
                    variant='outlined'
                    rules={{}}
                    errors={errors}
                    id='title'
                    name='title'
                    placeholder='Post Title'
                    label='Post Title'
                    type='text'
                    onBlurCallback={async (value) => {
                        if (value) {
                            await getSlugMutation.mutateAsync({ name: value })
                        }
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <CustomTextInput
                    control={control as any}
                    variant='outlined'
                    rules={{}}
                    errors={errors}
                    id='slug'
                    name='slug'
                    placeholder='Slug'
                    label='Slug'
                    type='text'
                />
            </Grid>
            <Grid item xs={6}>
                <CustomTextInput
                    control={control as any}
                    variant='outlined'
                    rules={{}}
                    errors={errors}
                    id='excerpt'
                    name='excerpt'
                    placeholder="Short summary of the post"
                    label={watch('excerpt')?.trim()?.length > 0 ? 'excerpt' : undefined}
                    type='text'
                />
            </Grid>
            <Grid item xs={12}>
                <CustomDropzoneInput
                    control={control}
                    name="hero_image"
                    label="Banner Image"
                    errors={errors}
                    trigger={trigger}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomTextEditor
                    name="content"
                    control={control}
                    label="Post Content"
                    rules={{ required: 'Content is required' }}
                    errors={errors}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomDropzoneInput
                    control={control}
                    name="post_images"
                    label="More Images"
                    errors={errors}
                    trigger={trigger}
                    multiple
                />
            </Grid>
        </Grid>
    )
}

export default UserPostForm