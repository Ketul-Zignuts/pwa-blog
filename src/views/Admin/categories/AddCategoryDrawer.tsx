'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm } from 'react-hook-form'
import { CategoryDataType } from '@/types/categoryTypes'
import CustomTextInput from '@/components/form/CustomTextInput'
import { Box, CircularProgress } from '@mui/material'
import CustomSwitch from '@/components/form/CustomSwitch'
import { yupResolver } from '@hookform/resolvers/yup'
import { addUpdateCategorySchema } from '@/constants/schema/admin/categorySchema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminCategoryCreateAction, adminCategoryUpdateAction } from '@/constants/api/admin/categories'
import { toast } from 'react-toastify'
import { globalConfig } from '@/configs/globalConfig'
import { useAppSelector } from '@/store'
import { slugGetAction } from '@/constants/api/slug'

type DrawerState = {
  open: boolean
  data: CategoryDataType
}

type Props = {
  open: DrawerState
  setOpen: React.Dispatch<React.SetStateAction<DrawerState>>
}

export type FormDataProps = {
  id: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  post_count: number;
  is_active: boolean;
};


const defaultValues: FormDataProps = {
  id: null,
  name: '',
  slug: '',
  description: '',
  icon: '',
  post_count: 0,
  is_active: true
}

const AddCategoryDrawer = ({ open, setOpen }: Props) => {
  const isEdit = open?.data;
  const queryClient = useQueryClient();
  const isRoAdmin = useAppSelector((state) => state?.auth?.user?.isroadmin)

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(addUpdateCategorySchema)
  })

  /* ---------- populate form on edit ---------- */
  useEffect(() => {
    if (open?.data) {
      reset({
        id: open?.data?.id || null,
        name: open?.data?.name || '',
        slug: open?.data?.slug || '',
        description: open?.data?.description || '',
        icon: open?.data?.icon || '',
        post_count: open?.data?.post_count || 0,
        is_active: open?.data?.is_active || false
      })
    } else {
      reset(defaultValues)
    }
  }, [open.data, reset])

  const handleClose = () => {
    reset()
    setOpen({ open: false, data: null })
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CategoryDataType) => {
      const apiCall = data?.id ? adminCategoryUpdateAction : adminCategoryCreateAction;
      return apiCall(data);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      handleClose();
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Something went wrong!';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    }
  });

  const getSlugMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => slugGetAction({ name }),
    onSuccess: (slugRes) => {
      setValue('slug', slugRes.slug, { shouldValidate: true })
    }
  })

  const onSubmit = async (data: any) => {
    if (isRoAdmin) {
      toast.error(globalConfig?.RO_ADMIN_MESSAGE)
      return
    }
    await mutate(data);
  };

  return (
    <Drawer
      open={open.open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 5 }}>
        <Typography variant="h5">
          {isEdit ? 'Edit Category' : 'Add Category'}
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <i className="ri-close-line text-2xl" />
        </IconButton>
      </Box>
      <Divider />
      <div className="p-5 flex flex-col gap-3">
        <CustomTextInput
          control={control as any}
          variant='outlined'
          rules={{}}
          errors={errors}
          id='name'
          name='name'
          placeholder='Category Name'
          label='Category Name'
          type='text'
          onBlurCallback={async (value) => {
            if (value) {
              await getSlugMutation.mutateAsync({ name: value })
            }
          }}
        />
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
        <CustomTextInput
          control={control as any}
          variant='outlined'
          rules={{}}
          errors={errors}
          id='icon'
          name='icon'
          placeholder='Icon'
          label='Icon'
          type='text'
        />
        <CustomTextInput
          control={control as any}
          variant='outlined'
          rules={{}}
          errors={errors}
          id='post_count'
          name='post_count'
          placeholder='Post Count'
          label='Post Count'
          type='number'
        />
        <CustomTextInput
          control={control as any}
          variant='outlined'
          rules={{}}
          errors={errors}
          id='description'
          name='description'
          placeholder='Descriptions'
          label='Descriptions'
          type='text'
          multiline={true}
          rows={4}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <CustomSwitch
              name="is_active"
              label="Active"
              control={control}
              errors={errors}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Button variant="contained" type="button" disabled={isPending} startIcon={isPending ? <CircularProgress color='warning' size={20} /> : null} onClick={handleSubmit(onSubmit)}>
              {isEdit ? 'Update' : 'Add'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer
