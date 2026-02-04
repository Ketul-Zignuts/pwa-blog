import * as yup from 'yup';

export const addUpdatePostSchema = yup.object({
    id: yup.string().nullable().notRequired().optional(),
    user_id: yup.string().uuid('Invalid user ID').required('Author is required'),
    category_id: yup.string().uuid('Invalid category').required('Category is required'),
    title: yup.string().trim().min(5, 'Title must be at least 5 characters').max(255, 'Title is too long').required('Title is required'),
    slug: yup.string().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly').required('Slug is required'),
    content: yup.string().min(20, 'Content is too short').required('Content is required'),
    excerpt: yup.string().max(300, 'Excerpt too long').nullable(),
    hero_image: yup.string().url('Hero image must be a valid URL').nullable(),
    post_images: yup.array().of(yup.string().url('Invalid image URL')).default([]),
    status: yup.mixed<'draft' | 'published' | 'archived'>().oneOf(['draft', 'published', 'archived']).required(),
    is_featured: yup.boolean().default(false),
    read_time: yup.number().integer().min(1, 'Read time must be at least 1 minute').nullable(),
    tags: yup.array().of(yup.string().trim()).default([]),
    seo_title: yup.string().max(60, 'SEO title should be under 60 characters').nullable(),
    seo_description: yup.string().max(160, 'SEO description should be under 160 characters').nullable(),
    published_at: yup
        .date()
        .nullable()
        .when('status', {
            is: 'published',
            then: schema =>
                schema.required('Publish date is required when post is published'),
        }),
});
