'use client'
import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useSettings } from '@/@core/hooks/useSettings'
import BlogLogo from '@/components/common/BlogLogo'
import { Avatar, Button, CircularProgress, ClickAwayListener, Fade, MenuList, Paper, Popper, Typography } from '@mui/material'
import themeConfig from '@/configs/themeConfig'
import { persistor, useAppDispatch, useAppSelector } from '@/store'
import { usePathname, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutAction } from '@/constants/api/auth'
import { authLogout } from '@/store/slices/authSlice'
import { toast } from 'react-toastify'
import NotificationDropDown from './NotificationDropDown'
import { useNotifications } from '@/hooks/useNotifications'
import { useNotificationBadge } from '@/hooks/useNotificationBadge'

const BadgeContentSpan = styled('span')({
    width: 8,
    height: 8,
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: 'var(--mui-palette-success-main)',
    boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
        theme.palette.mode === 'light'
            ? alpha(theme.palette.common.black, 0.05)
            : alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'light'
                ? alpha(theme.palette.common.black, 0.1)
                : alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
    }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}))

type HomeNavbarProps = {
    showBoxShadow?: boolean
}

export default function HomeNavbar({ showBoxShadow = false }: HomeNavbarProps) {
    const router = useRouter();
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const { settings } = useSettings();
    const isLightMode = settings?.mode === 'light'
    const user = useAppSelector((state) => state?.auth?.user)
    const queryClient = useQueryClient()
    const [notificationOpen, setNotificationOpen] = React.useState(false)
    const notificationRef = React.useRef<HTMLButtonElement>(null)

    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLDivElement>(null)
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const isPostFormPage = pathName === '/blog/post';
    const notificationsQuery = useNotifications(user?.uid || '')
    const notificationCountData = useNotificationBadge(user?.uid || '')
    const notificationCount = notificationCountData?.unreadCount || 0;


    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open)
    }

    const handleDropdownOpen = () => {
        !open ? setOpen(true) : setOpen(false)
    }

    const handleDropdownClose = (event?: React.MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
        if (url) {
            router.push(url)
        }

        if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
            return
        }

        setOpen(false)
    }

    const { mutate: logout, isPending } = useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            persistor.purge()
            dispatch(authLogout())
            queryClient.clear()
            router.replace('/login')
            toast.success('Logout successfully')
        },
        onError: (err: any) => {
            const message = err?.message || err?.response?.data?.message || 'Logout failed!';
            toast.error(message)
        }
    })


    const redirectToHome = () => {
        router.push('/home')
    }

    const handleUserLogout = async () => {
        await logout()
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position='static'
                elevation={0}
                sx={(theme) => ({
                    backgroundColor: isLightMode
                        ? theme.palette.background.paper
                        : 'inherit',
                    color: isLightMode
                        ? theme.palette.text.primary
                        : 'inherit',
                    boxShadow: isLightMode || showBoxShadow
                        ? `0px 2px 6px ${theme.palette.primary.main}33`
                        : 'none'
                })}
            >
                <Toolbar>
                    {/* Hamburger → Opens Drawer */}
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        sx={{ mr: 2, display: { md: 'none', sm: 'block' } }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ cursor: 'pointer' }} onClick={redirectToHome}>
                        <BlogLogo className={'w-12 h-12'} />
                    </Box>
                    <Typography
                        variant='h6'
                        noWrap
                        component='div'
                        sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
                        onClick={redirectToHome}
                    >
                        {themeConfig.templateName}
                    </Typography>

                    <Box sx={{display:{sm:'none',xs:'none',md:'block'}}}>
                        <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder='Search…'
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop Icons Only */}
                    <Box sx={{ display:'flex' }}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Button color="inherit" onClick={redirectToHome} sx={{display:{sm:'none',md:'block'}}}>Home</Button>
                            <Button color="inherit" sx={{display:{sm:'none',md:'block'}}}>Filter</Button>
                            {!isPostFormPage && (<Button color="primary" variant='contained' onClick={() => router.push('/blog/post')}>POST</Button>)}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size='small' color='inherit'>
                                <Badge badgeContent={4} color='primary'>
                                    <MailIcon />
                                </Badge>
                            </IconButton>

                            <IconButton
                                size='small'
                                color='inherit'
                                ref={notificationRef}
                                onClick={() => setNotificationOpen(!notificationOpen)}
                            >
                                <Badge badgeContent={notificationCount} color='primary' max={99}>
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                            {user ? (
                                <Badge
                                    ref={anchorRef}
                                    overlap='circular'
                                    badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    className='mis-2'
                                >
                                    <Avatar
                                        ref={anchorRef}
                                        alt={user?.displayName}
                                        src={user?.photoURL || '/images/avatars/1.png'}
                                        onClick={handleDropdownOpen}
                                        className='cursor-pointer bs-[38px] is-[38px]'
                                    />
                                </Badge>
                            ) : (
                                <IconButton onClick={() => router.push('/login')}>
                                    <AccountCircle className='cursor-pointer bs-[34px] is-[34px]' />
                                </IconButton>
                            )}
                            <Popper
                                open={open}
                                transition
                                disablePortal
                                placement='bottom-end'
                                anchorEl={anchorRef.current}
                                className='z-[9999] min-is-[240px] !mbs-4 z-[1]'
                            >
                                {({ TransitionProps, placement }) => (
                                    <Fade
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
                                        }}
                                    >
                                        <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
                                            <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                                                <MenuList>
                                                    <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                                                        <Avatar alt={user?.displayName} src={user?.photoURL || '/images/avatars/1.png'} />
                                                        <div className='flex items-start flex-col'>
                                                            <Typography className='font-medium' color='text.primary'>
                                                                {user?.displayName}
                                                            </Typography>
                                                            <Typography variant='caption'>{user?.email || user?.phoneNumber || ''}</Typography>
                                                        </div>
                                                    </div>
                                                    <Divider className='mlb-1' />
                                                    <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/profile')}>
                                                        <i className='ri-user-3-line' />
                                                        <Typography color='text.primary'>My Profile</Typography>
                                                    </MenuItem>
                                                    <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                                                        <i className='ri-settings-4-line' />
                                                        <Typography color='text.primary'>Settings</Typography>
                                                    </MenuItem>
                                                    <div className='flex items-center plb-2 pli-4'>
                                                        <Button
                                                            fullWidth
                                                            variant='contained'
                                                            color='error'
                                                            size='small'
                                                            endIcon={isPending ? <CircularProgress color='warning' size={20} /> : <i className='ri-logout-box-r-line' />}
                                                            onClick={handleUserLogout}
                                                            sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                                                            disabled={isPending}
                                                        >
                                                            Logout
                                                        </Button>
                                                    </div>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 🔹 Mobile Drawer */}
            <Drawer
                anchor='left'
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{ position: 'relative' }}
            >
                <Box
                    sx={{ width: 250 }}
                    role='presentation'
                    onClick={toggleDrawer(false)}
                >
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <BlogLogo />
                            </ListItemIcon>
                            <ListItemText primary={themeConfig.templateName} />
                        </ListItem>
                        <Divider sx={{ my: 3 }} />
                        <ListItem>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary='My Profile' />
                        </ListItem>

                        <ListItem sx={{ cursor: 'pointer' }} onClick={() => setNotificationOpen(!notificationOpen)}>
                            <ListItemIcon>
                                <Badge badgeContent={notificationCount} color='primary' max={99} anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                    <NotificationsIcon />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary='Notifications' />
                        </ListItem>
                    </List>

                    <Divider />

                    <List sx={{
                        position: 'absolute',
                        bottom: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <ListItem
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: 1
                            }}
                        >
                            <Avatar
                                alt={user?.displayName || ''}
                                src={user?.photoURL || '/images/avatars/1.png'}
                                sx={{ width: 52, height: 52 }}
                            />

                            <ListItemText
                                primary={user?.displayName}
                                secondary={user?.email || user?.phoneNumber}
                                primaryTypographyProps={{ fontWeight: 600 }}
                                secondaryTypographyProps={{ fontSize: 13 }}
                                sx={{ m: 0 }}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <NotificationDropDown
                anchorRef={notificationRef}
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                notificationsQuery={notificationsQuery}
            />
        </Box>
    )
}
