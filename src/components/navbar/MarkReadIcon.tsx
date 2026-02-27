import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const MotionBox = motion(Box)

type MarkReadIconProps = {
    read: boolean
    id:string
    handleReadNotification: (
        event: React.MouseEvent<HTMLElement>,
        id: string
    ) => void
}

const labelVariants = {
  collapsed: {
    opacity: 0,
    marginLeft: 0,
  },
  expanded: {
    opacity: 1,
    marginLeft: 6,
  },
}

const MarkReadIcon = ({ read, handleReadNotification, id }: MarkReadIconProps) => {
  const theme = useTheme()

  return (
    <MotionBox
      initial="collapsed"
      animate="collapsed"
      whileHover="expanded"
      variants={{
        collapsed: { width: 36 },
        expanded: {
          width: read ? 150 : 130,
          backgroundColor: theme.palette.primary.main + '20',
        },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      sx={{
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 32,
        borderRadius: 20,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: read ? 'default' : 'pointer',
        px: 1,
      }}
      onClick={(e) => {
        if (!read) handleReadNotification(e, id)
      }}
    >
      {read ? (
        <DoneAllIcon fontSize="small" />
      ) : (
        <DoneIcon fontSize="small" />
      )}

      <motion.div
        variants={labelVariants}
        transition={{ duration: 0.15 }}
        style={{ whiteSpace: 'nowrap' }}
      >
        <Typography variant="body2">
          {read ? 'Marked as read' : 'Mark as read'}
        </Typography>
      </motion.div>
    </MotionBox>
  )
}

export default MarkReadIcon