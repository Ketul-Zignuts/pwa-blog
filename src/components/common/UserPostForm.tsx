import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form';
import CustomAutocompleteInput from '../form/CustomAutoCompleteInput';
import { useMutation } from '@tanstack/react-query';
import { adminPostCategoryListDropDownAction } from '@/constants/api/admin/categories';
import { slugGetAction } from '@/constants/api/slug';
import CustomTextInput from '../form/CustomTextInput';
import CustomTextEditor from '../form/CustomTextEditor';
import CustomDropzoneInput from '../form/CustomDropzoneInput';
import CustomDatePicker from '../form/CustomDatePicker';
import { PostDetailDataType } from '@/types/postTypes';

type UserPostFormProps = {
    data?:PostDetailDataType
}

const UserPostForm = ({data} : UserPostFormProps) => {
    const [categoryList, setCategoryList] = useState<any[]>([])
    const { control, watch, setValue, trigger, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags'
    });

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
        const currentTags = watch('tags');
        if (!currentTags || currentTags.length === 0) {
            append({ value: '' });
        }
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <CustomAutocompleteInput
                    name="category_id"
                    label="Start typing to search..."
                    control={control}
                    options={categoryList}
                    onSearch={(q) => {
                        if (q?.trim()) categorySearchMutation.mutate(q)
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
                    disabled={getSlugMutation?.isPending}
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
                    extraTextFieldProps={{
                        InputLabelProps: {
                            shrink: watch('excerpt')?.trim()?.length > 0 ? true : false
                        }
                    }}
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
                    oldImage={data?.hero_image ? `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/post-images/${data?.hero_image}` : undefined}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, mt: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                                Post Tags
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                                Add searchable keywords so users can find this post when searching
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<i className="ri-add-line text-[22px]" />}
                            onClick={() => append({ value: '' })}
                            size="small"
                            color='info'
                        >
                            Add Tag
                        </Button>
                    </Box>
                    <Grid container spacing={4}>
                        {fields.map((_, index) => (
                            <Grid item xs={12} key={index}>
                                <CustomTextInput
                                    id={`tags.${index}.value`}
                                    control={control}
                                    name={`tags.${index}.value`}
                                    placeholder={`Tag ${index + 1}`}
                                    label={`Tag ${index + 1}`}
                                    rules={{}}
                                    errors={errors}
                                    fullWidth
                                    customMsg={((errors as any)?.tags?.[index]?.message)}
                                    extraTextFieldProps={{
                                        InputLabelProps: {
                                            shrink: true
                                        }
                                    }}
                                    icon={<i className="ri-delete-bin-line" />}
                                    iconButtonDisable={fields.length <= 1}
                                    onIconPress={() => fields.length > 1 && remove(index)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{ mb: 4 }}>
                <CustomTextEditor
                    name="content"
                    control={control}
                    label="Post Content"
                    rules={{ required: 'Content is required' }}
                    errors={errors}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomAutocompleteInput
                    name="status"
                    label="Post Status"
                    control={control}
                    options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'published', label: 'Publish' }
                    ]}
                    errors={errors}
                    labelPlaceHolder='Post Status'
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomDatePicker
                    name="published_at"
                    control={control}
                    label="Publish on date"
                    dateFormat="MMM dd, yyyy"
                    rules={{ required: true }}
                    errors={errors}
                />
            </Grid>
        </Grid>
    )
}

export default UserPostForm