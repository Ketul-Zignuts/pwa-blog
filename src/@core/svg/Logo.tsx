// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={'w-10 h-10 text-primary'}
      >
        {/* Outer geometric frame */}
        <path
          d="M4 8L8 4L24 4L28 8L28 24L24 28L8 28L4 24L4 8Z"
          fill="currentColor"
          opacity="0.15"
        />

        {/* Stylized B */}
        <path
          d="M12 10L12 22L18.5 22C20.433 22 22 20.433 22 18.5C22 17.3 21.4 16.25 20.5 15.65C21 15.15 21.3 14.45 21.3 13.7C21.3 12.21 20.19 11 18.7 11L12 10ZM14.5 12.5L18.2 12.5C18.64 12.5 19 12.86 19 13.3C19 13.74 18.64 14.1 18.2 14.1L14.5 14.1L14.5 12.5ZM14.5 16L18.5 16C19.33 16 20 16.67 20 17.5C20 18.33 19.33 19 18.5 19L14.5 19L14.5 16Z"
          fill="currentColor"
        />
      </svg>
  )
}

export default Logo
