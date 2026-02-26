'use client'

import { useRef, useEffect } from 'react'
import type { MouseEvent, ReactNode } from 'react'
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
import type { Theme } from '@mui/material/styles'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import type { ThemeColor } from '@core/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'
import CustomAvatar from '@core/components/mui/Avatar'
import themeConfig from '@configs/themeConfig'
import { useSettings } from '@core/hooks/useSettings'
import { getInitials } from '@/utils/getInitials'
import { Avatar } from '@mui/material'
import { useNotifications } from '@/hooks/useNotifications'
import { useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '@/store'
import type {
  RealNotificationPage, 
  RealTimeNotificationData 
} from '@/types/notificationTypes'
import dayjs from '@/utils/dayJsRelative'
import { getRandomMuiColor } from '@/utils/Utils'

export interface NotificationsType {
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
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
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
    return <Avatar src={avatarImage} className='w-10 h-10' sx={(theme:any) => ({backgroundColor:theme.palette[colorName].main + '20'})} />
  }
  
  if (avatarText) {
    return (
      <CustomAvatar color={avatarColor as ThemeColor} skin='light' className='w-10 h-10'>
        {getInitials(avatarText)}
      </CustomAvatar>
    )
  }
  
  return (
    <CustomAvatar color={avatarColor as ThemeColor} skin='light' className='w-10 h-10'>
      {getInitials(title)}
    </CustomAvatar>
  )
}

const transformNotifications = (
  notificationsQuery: ReturnType<typeof useNotifications>
): NotificationsType[] => {
  if (!notificationsQuery.data?.pages?.length) return []
  
  return notificationsQuery.data.pages
    .flatMap((page: RealNotificationPage) => page.data)
    .map((notif: RealTimeNotificationData) => ({
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
  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state?.auth?.user)

  const notifications = transformNotifications(notificationsQuery)
  const notificationCount = notifications.filter((notification) => !notification.read).length
  const readAll = notifications.every((notification) => notification.read)
  const isLoading = notificationsQuery.isPending || notificationsQuery.isFetching
  const hasNotifications = notifications.length > 0
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleReadNotification = (event: MouseEvent<HTMLElement>, _value: boolean, _index: number) => {
    event.stopPropagation()
    console.log('TODO: Mark notification as read')
  }

  const handleRemoveNotification = (event: MouseEvent<HTMLElement>, _index: number) => {
    event.stopPropagation()
    console.log('TODO: Remove notification')
  }

  const readAllNotifications = () => {
    console.log('TODO: Mark all notifications as read')
  }

  const onClickRefreshIcon = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
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
            className: 'z-[9999] is-full !mbs-4 z-[1] max-bs-[550px] bs-[550px]',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  padding: themeConfig.layoutPadding
                }
              }
            ]
          }
        : { className: 'z-[9999] is-96 !mbs-4 z-[1] max-bs-[550px] bs-[550px]' })}
    >
      {({ TransitionProps, placement }) => (
        <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
          <Paper className={classnames('bs-full flex flex-col', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
            <ClickAwayListener onClickAway={onClose}>
              <div className='bs-full flex flex-col'>
                {/* Header - Full version styling */}
                <div className='flex items-center justify-between plb-2 pli-4 is-full gap-4'>
                  <Typography variant='h5' className='flex-auto'>
                    Notifications
                  </Typography>
                  {notificationCount > 0 && (
                    <Chip size='small' variant='tonal' color='primary' label={`${notificationCount} New`} />
                  )}
                  {hasNotifications && (
                    <Tooltip
                      title={readAll ? 'Mark all as unread' : 'Mark all as read'}
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                    >
                      <IconButton size='small' onClick={readAllNotifications} className='text-textPrimary'>
                        <i className={readAll ? 'ri-mail-line' : 'ri-mail-open-line'} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip
                    title='Refresh Notifications'
                    placement={placement === 'bottom-end' ? 'left' : 'right'}
                  >
                    <IconButton size='small' onClick={onClickRefreshIcon} className='text-textPrimary'>
                      <i className='ri-refresh-line' />
                    </IconButton>
                  </Tooltip>
                </div>

                <Divider />

                {/* Content */}
                <div className='flex-1 flex flex-col overflow-hidden'>
                  {isLoading && (
                    <div className='flex-1 flex items-center justify-center p-8'>
                      <CircularProgress size={24} />
                    </div>
                  )}

                  {!isLoading && !hasNotifications && (
                    <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                      <NotificationsIcon className='text-4xl text-gray-400 mb-2' />
                      <Typography variant='body2' className='text-textSecondary'>
                        No notifications yet
                      </Typography>
                    </div>
                  )}

                  {!isLoading && hasNotifications && (
                    <ScrollWrapper hidden={hidden}>
                      {notifications.map((notification, index) => {
                        const { title, subtitle, time, read, avatarImage, avatarText, avatarColor } = notification
                        return (
                          <div
                            key={index}
                            className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                              'border-be': index !== notifications.length - 1
                            })}
                            onClick={e => handleReadNotification(e, true, index)}
                          >
                            {getAvatar({ avatarImage, avatarText, title, avatarColor })}
                            <div className='flex flex-col flex-auto'>
                              <Typography className='font-medium mbe-1 text-textPrimary'>
                                {title}
                              </Typography>
                              <Typography variant='caption' className='mbe-2 text-textSecondary'>
                                {subtitle}
                              </Typography>
                              <Typography variant='caption' className='text-textSecondary'>
                                {time}
                              </Typography>
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
                                onClick={e => handleRemoveNotification(e, index)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </ScrollWrapper>
                  )}
                </div>

                <Divider />
                <div className='p-4'>
                  <Button fullWidth variant='contained' size='small'>
                    View All Notifications
                  </Button>
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
