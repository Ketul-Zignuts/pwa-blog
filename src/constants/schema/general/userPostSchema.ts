import * as yup from 'yup';

export const userPostSchema = yup.object({
  id: yup.string().nullable().notRequired().optional(),
  category_id: yup.string().uuid('Invalid category').required('Category is required'),
  title: yup.string().trim().min(5, 'Title must be at least 5 characters').max(255, 'Title is too long').required('Title is required'),
  slug: yup.string().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly').required('Slug is required'),
  content: yup
    .string()
    .required('Content is required')
    .test(
      'content-not-empty',
      'Content is required',
      value => {
        if (!value) return false

        const text = value
          .replace(/<[^>]*>/g, '') // strip HTML
          .replace(/\s+/g, '')     // remove spaces
          .trim()

        return text.length > 0
      }
    )
    .test(
      'content-min-length',
      'Content is too short',
      value => {
        if (!value) return false

        const text = value
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        return text.length >= 20
      }
    ),
  excerpt: yup.string().max(300, 'Excerpt too long').nullable(),
  hero_image: yup
    .mixed<File>()
    .nullable()
    .when('id', {
      is: (id: string | null) => !id,
      then: schema =>
        schema.required('Hero image is required'),
      otherwise: schema =>
        schema.notRequired(),
    })
    .test('fileSize', 'File size must be less than 5MB', value => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only PNG, JPG, WebP images are allowed', value => {
      if (!value || !(value instanceof File)) return true;
      return ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(value.type);
    }),
  status: yup.mixed<'draft' | 'published' | 'archived'>().oneOf(['draft', 'published', 'archived']).required(),
  is_featured: yup.boolean().default(false),
  tags: yup.array()
    .transform((value, originalValue) => {
      if (Array.isArray(originalValue)) {
        return originalValue.map(item =>
          typeof item === 'object' && item.value !== undefined
            ? item.value.trim()
            : item?.toString()?.trim() || ''
        );
      }
      return [''];
    })
    .of(yup.string().required('Tag cannot be empty')),
  published_at: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .nullable()
    .when('status', {
      is: 'published',
      then: schema =>
        schema.required('Publish date is required when the post status is set to Publish.'),
    }),
});
