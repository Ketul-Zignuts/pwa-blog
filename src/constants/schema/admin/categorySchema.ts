import * as yup from 'yup';

export const addUpdateCategorySchema = yup.object({
    id: yup.string().nullable().notRequired(),
    name: yup.string().required('Name is required').max(128, 'Name must be at most 128 characters'),
    description: yup.string().nullable().max(500, 'Description must be at most 500 characters'),
    icon: yup.string().nullable().max(64, 'Icon must be at most 64 characters'),
    post_count: yup.number().nullable().notRequired(),
    is_active: yup.boolean().required('Active status is required'),
    slug: yup.string().required('Slug is required').max(128, 'Slug must be at most 128 characters')
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must be lowercase and URL-friendly'
        ),
})
