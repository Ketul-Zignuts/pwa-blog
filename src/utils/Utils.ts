import { ChipProps } from "@mui/material";

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03dac6', '#4caf50', '#ff9800'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

export const getRandomMuiColor = (): ChipProps['color'] => {
  const colors: ChipProps['color'][] = [
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

export const calculateReadTime = (content: string) => {
  const text = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const words = text ? text.split(' ').length : 0
  return Math.max(1, Math.ceil(words / 200))
}

export const getCommonScrollbarStyle = (isDarkMode: boolean) => ({
  scrollbarWidth: 'thin',
  scrollbarColor: isDarkMode
    ? 'rgba(255,255,255,0.2) transparent'
    : 'rgba(0,0,0,0.2) transparent',

  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: isDarkMode
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(0,0,0,0.2)',
    borderRadius: '20px',
    transition: 'background-color 0.2s ease'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: isDarkMode
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(0,0,0,0.35)'
  }
})