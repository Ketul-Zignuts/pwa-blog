'use client'

import { useRef, useEffect, ReactNode, MouseEvent } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Avatar } from '@mui/material'
import classnames from 'classnames'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '@/store'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationPage, RealTimeNotificationData } from '@/types/notificationTypes'
import CustomAvatar from '@core/components/mui/Avatar'
import themeConfig from '@configs/themeConfig'
import { getInitials } from '@/utils/getInitials'
import dayjs from '@/utils/dayJsRelative'
import { getRandomMuiColor } from '@/utils/Utils'
import { useSettings } from '@core/hooks/useSettings'
import { patchNotification } from '@/constants/api/notification'
import MarkReadIcon from './MarkReadIcon'
import { useConfirm } from '@/hooks/useConfirm'


export interface NotificationsType {
  id: string
  title: string
  subtitle: string
  time: string
  read: boolean
  avatarImage?: string | null
  avatarText?: string | null
  avatarColor?: string
}

type NotificationDropDownProps = {
  anchorRef: React.RefObject<HTMLButtonElement>
  open: boolean
  onClose: () => void
  notificationsQuery: ReturnType<typeof useNotifications>
}

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  }
  return (
    <div className='bs-full flex-1 flex flex-col overflow-auto'>
      {children}
    </div>
  )
}

const getAvatar = (params: {
  avatarImage?: string | null
  avatarText?: string | null
  title: string
  avatarColor?: string
}) => {
  const { avatarImage, avatarText, title, avatarColor = 'primary' } = params
  const colorName = getRandomMuiColor() || 'primary'

  if (avatarImage) {
    return (
      <Avatar
        src={avatarImage}
        className='w-10 h-10'
        sx={(theme: any) => ({ backgroundColor: theme.palette[colorName].main + '20' })}
      />
    )
  }

  if (avatarText) {
    return (
      <CustomAvatar color={avatarColor as any} skin='light' className='w-10 h-10'>
        {getInitials(avatarText)}
      </CustomAvatar>
    )
  }

  return (
    <CustomAvatar color={avatarColor as any} skin='light' className='w-10 h-10'>
      {getInitials(title)}
    </CustomAvatar>
  )
}

const transformNotifications = (notificationsQuery: ReturnType<typeof useNotifications>): NotificationsType[] => {
  if (!notificationsQuery.data?.pages?.length) return []

  return notificationsQuery.data.pages
    .flatMap((page: NotificationPage) => page.data)
    .map((notif: RealTimeNotificationData) => ({
      id: notif.id,
      title: notif.title,
      subtitle: notif.message,
      time: notif.created_at ? dayjs(notif.created_at).fromNow() : 'now',
      read: notif.is_read,
      avatarImage: notif.actor?.photoURL ?? null,
      avatarText: notif.actor?.displayName ?? null,
      avatarColor: 'primary'
    }))
}

const NotificationDropDown = ({ anchorRef, open, onClose, notificationsQuery }: NotificationDropDownProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { settings } = useSettings()
  const { confirm } = useConfirm()
  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state?.auth?.user)

  const notifications = transformNotifications(notificationsQuery)
  const notificationCount = notifications.filter((notification) => !notification.read).length
  const readAll = notifications.every((notification) => notification.read)
  const isLoading = notificationsQuery.isFetching || notificationsQuery.isLoading
  const hasNotifications = notifications.length > 0
  const hidden = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'))

  const handlePatchNotification = useMutation({
    mutationFn: (data: any) => patchNotification(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['notifications', user?.uid], (oldData: any) => {
        if (!oldData) return oldData

        let updatedPages = oldData.pages

        // ==============================
        // MARK SINGLE AS READ
        // ==============================
        if (variables.action === 'mark_read' && !variables.all_read) {
          updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((notif: any) =>
              notif.id === variables.id
                ? { ...notif, is_read: true }
                : notif
            )
          }))
        }

        // ==============================
        // MARK ALL AS READ
        // ==============================
        if (variables.action === 'mark_read' && variables.all_read) {
          updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((notif: any) => ({
              ...notif,
              is_read: true
            }))
          }))
        }

        // ==============================
        // DELETE SINGLE
        // ==============================
        if (variables.action === 'delete' && !variables.all_read) {
          updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((notif: any) => notif.id !== variables.id)
          }))
        }

        // ==============================
        // DELETE ALL READ
        // ==============================
        if (variables.action === 'delete' && variables.all_read) {
          updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((notif: any) => !notif.is_read)
          }))
        }

        // ==============================
        // DELETE ALL (READ + UNREAD)
        // ==============================
        if (variables.action === 'delete_all') {
          updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            data: []
          }))
        }

        return {
          ...oldData,
          pages: updatedPages
        }
      })
      queryClient.invalidateQueries({ queryKey: ['notifications-count', user?.uid] })
    }
  })

  const handleDeleteAllNotification = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const ok = await confirm({
      title: 'Delete All Notifications',
      description: 'This action cannot be undone',
      confirmText: 'Delete'
    })

    if (!ok) return

    await handlePatchNotification.mutate({ action: 'delete_all', all_read: false, id: '' })
  }

  const handleReadNotification = async (event: MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation()
    await handlePatchNotification.mutate({ action: 'mark_read', all_read: false, id })
  }

  const handleRemoveNotification = async (event: MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation()
    await handlePatchNotification.mutate({ action: 'delete', all_read: false, id })
  }

  const handleRemoveAllNotification = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    await handlePatchNotification.mutate({ action: 'delete', all_read: true, id: '' })
  }

  const readAllNotifications = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    await handlePatchNotification.mutate({ action: 'mark_read', all_read: true, id: '' })
  }

  const onClickRefreshIcon = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.uid] })
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        const availableHeight = window.innerHeight - 100
        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
    adjustPopoverHeight()
    return () => window.removeEventListener('resize', adjustPopoverHeight)
  }, [])

  return (
    <Popper
      open={open}
      transition
      disablePortal
      placement='bottom-end'
      ref={ref}
      anchorEl={anchorRef.current}
      {...(isSmallScreen
        ? {
          className: 'z-[9999] is-full !mbs-4 max-bs-[550px] bs-[550px]',
          modifiers: [
            {
              name: 'preventOverflow',
              options: { padding: themeConfig.layoutPadding }
            }
          ]
        }
        : { className: 'z-[9999] is-96 !mbs-4 max-bs-[550px] bs-[550px]' })}
    >
      {({ TransitionProps, placement }) => (
        <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
          <Paper className={classnames('bs-full flex flex-col', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
            <ClickAwayListener onClickAway={onClose}>
              <div className='bs-full flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between plb-2 pli-4 is-full gap-4'>
                  <Typography variant='h5' className='flex-auto'>Notifications</Typography>
                  {notificationCount > 0 && <Chip size='small' variant='tonal' color='primary' label={`Total ${notificationCount}`} />}
                  {hasNotifications && (
                    <Tooltip title={'Delete all marked as read notifications'} placement={placement === 'bottom-end' ? 'left' : 'right'} slotProps={{
                      popper: {
                        sx: { zIndex: 15000 }
                      }
                    }}>
                      <IconButton size='small' color='error' onClick={(e) => handleRemoveAllNotification(e)} >
                        <i className={'ri-delete-bin-line'} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasNotifications && (
                    <Tooltip title={readAll ? 'Mark all as unread' : 'Mark all as read'} placement={placement === 'bottom-end' ? 'left' : 'right'} slotProps={{
                      popper: {
                        sx: { zIndex: 15000 }
                      }
                    }}>
                      <IconButton size='small' onClick={readAllNotifications} color='info' >
                        <i className={readAll ? 'ri-mail-line' : 'ri-mail-open-line'} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title='Refresh Notifications' placement={placement === 'bottom-end' ? 'left' : 'right'} slotProps={{
                    popper: {
                      sx: { zIndex: 15000 }
                    }
                  }}>
                    <IconButton size='small' onClick={onClickRefreshIcon} color='success'>
                      <i className='ri-refresh-line' />
                    </IconButton>
                  </Tooltip>
                </div>

                <Divider />

                {/* Content */}
                <ScrollWrapper hidden={hidden}>
                  {isLoading && (
                    <div className='flex-1 flex items-center justify-center p-8'>
                      <CircularProgress size={24} />
                    </div>
                  )}

                  {!isLoading && !hasNotifications && (
                    <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                      <NotificationsIcon className='text-4xl text-gray-400 mb-2' />
                      <Typography variant='body2' className='text-textSecondary'>No notifications yet</Typography>
                    </div>
                  )}

                  {!isLoading && hasNotifications && (
                    <div id='notification-scroll-container' className='flex-1 flex flex-col overflow-auto'>
                      <InfiniteScroll
                        dataLength={notifications.length}
                        next={() => notificationsQuery.fetchNextPage()}
                        hasMore={!!notificationsQuery.hasNextPage}
                        loader={
                          <div className='flex items-center justify-center p-4'>
                            <CircularProgress size={20} />
                          </div>
                        }
                        scrollableTarget='notification-scroll-container'
                      >
                        {notifications.map((notification, index) => {
                          const { id, title, subtitle, time, read, avatarImage, avatarText, avatarColor } = notification
                          return (
                            <div style={{ position: 'relative' }}>
                              <div
                                key={index}
                                className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group position-relative', {
                                  'border-be': index !== notifications.length - 1
                                })}
                              >
                                {getAvatar({ avatarImage, avatarText, title, avatarColor })}
                                <div className='flex flex-col flex-auto'>
                                  <Typography className='font-medium mbe-1 text-textPrimary'>{title}</Typography>
                                  <Typography variant='caption' className='mbe-2 text-textSecondary'>{subtitle}</Typography>
                                  <Typography variant='caption' className='text-textSecondary'>{time}</Typography>
                                </div>
                                <div className='flex flex-col items-end gap-2.5'>
                                  <Badge
                                    variant='dot'
                                    color={read ? 'secondary' : 'primary'}
                                    className={classnames('mbs-1 mie-1', {
                                      'invisible group-hover:visible': read
                                    })}
                                  />
                                  <i
                                    className='ri-close-line text-xl invisible group-hover:visible text-textSecondary hover:text-error-main cursor-pointer'
                                    onClick={e => handleRemoveNotification(e, id)}
                                  />
                                </div>
                              </div>
                              <MarkReadIcon
                                id={id}
                                read={read}
                                handleReadNotification={handleReadNotification}
                              />
                            </div>
                          )
                        })}
                      </InfiniteScroll>
                    </div>
                  )}
                </ScrollWrapper>

                <Divider />
                <div className='p-4'>
                  <Button fullWidth variant='contained' size='small' color='error' onClick={(e) => handleDeleteAllNotification(e)}>Delete All Notifications</Button>
                </div>
              </div>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}

export default NotificationDropDown