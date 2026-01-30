import React from 'react'
import { motion } from 'framer-motion'

interface BlogLogoProps {
  className?: string
  animate?: boolean
}

const BlogLogo = ({ className = 'w-8 h-8', animate = false }: BlogLogoProps) => {
  if (!animate) {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
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

  return (
    <motion.svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {/* Animated background glow circles */}
      <motion.circle
        cx="16"
        cy="16"
        r="14"
        fill="currentColor"
        opacity="0.05"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.1, 0.05],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="16"
        cy="16"
        r="12"
        fill="currentColor"
        opacity="0.03"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.3, 1],
          opacity: [0, 0.08, 0.03],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
          delay: 0.3,
          ease: "easeInOut",
        }}
      />

      {/* Rotating outer ring */}
      <motion.path
        d="M16 2 A14 14 0 0 1 30 16"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{
          pathLength: [0, 1, 0],
          rotate: 360,
        }}
        transition={{
          pathLength: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ originX: '16px', originY: '16px' }}
      />

      <motion.path
        d="M30 16 A14 14 0 0 1 16 30"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{
          pathLength: [0, 1, 0],
          rotate: 360,
        }}
        transition={{
          pathLength: {
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ originX: '16px', originY: '16px' }}
      />

      <motion.path
        d="M16 30 A14 14 0 0 1 2 16"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{
          pathLength: [0, 1, 0],
          rotate: 360,
        }}
        transition={{
          pathLength: {
            duration: 2,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ originX: '16px', originY: '16px' }}
      />

      <motion.path
        d="M2 16 A14 14 0 0 1 16 2"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{
          pathLength: [0, 1, 0],
          rotate: 360,
        }}
        transition={{
          pathLength: {
            duration: 2,
            repeat: Infinity,
            delay: 1.5,
            ease: "easeInOut",
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ originX: '16px', originY: '16px' }}
      />

      {/* Animated corner accents */}
      <motion.path
        d="M6 6 L8 4 L10 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.path
        d="M26 6 L24 4 L22 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 0.75,
          ease: "easeInOut",
        }}
      />

      <motion.path
        d="M26 26 L24 28 L22 26"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.5,
          ease: "easeInOut",
        }}
      />

      <motion.path
        d="M6 26 L8 28 L10 26"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 2.25,
          ease: "easeInOut",
        }}
      />

      {/* Outer geometric frame with pulsing effect */}
      <motion.path
        d="M4 8 Q4 4 8 4 L24 4 Q28 4 28 8 L28 24 Q28 28 24 28 L8 28 Q4 28 4 24 Z"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.08, 0.15, 0.08],
          scale: [0.98, 1, 0.98],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Decorative inner frame elements */}
      <motion.rect
        x="6"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        opacity="0.2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 1, 0],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.rect
        x="24"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        opacity="0.2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 1, 0],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.6,
          ease: "easeInOut",
        }}
      />

      <motion.rect
        x="24"
        y="24"
        width="2"
        height="2"
        fill="currentColor"
        opacity="0.2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 1, 0],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1.2,
          ease: "easeInOut",
        }}
      />

      <motion.rect
        x="6"
        y="24"
        width="2"
        height="2"
        fill="currentColor"
        opacity="0.2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 1, 0],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1.8,
          ease: "easeInOut",
        }}
      />

      {/* Main B letter - split into segments for animation */}
      {/* Vertical bar of B */}
      <motion.path
        d="M12 10L12 22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.8, delay: 0.3 },
          opacity: { duration: 0.3, delay: 0.3 },
        }}
      />

      {/* Top curve of B with shimmer effect */}
      <motion.path
        d="M12 11L18.7 11C20.19 11 21.3 12.21 21.3 13.7C21.3 14.45 21 15.15 20.5 15.65"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.8, delay: 0.5 },
          opacity: { duration: 0.3, delay: 0.5 },
        }}
      />

      <motion.path
        d="M14.5 12.5L18.2 12.5C18.64 12.5 19 12.86 19 13.3C19 13.74 18.64 14.1 18.2 14.1L14.5 14.1L14.5 12.5Z"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          ease: "backOut",
        }}
      />

      {/* Shimmer effect on top curve */}
      <motion.path
        d="M14.5 12.5L18.2 12.5C18.64 12.5 19 12.86 19 13.3C19 13.74 18.64 14.1 18.2 14.1L14.5 14.1L14.5 12.5Z"
        fill="currentColor"
        opacity="0.5"
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: [20, 20],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
      />

      {/* Bottom curve of B */}
      <motion.path
        d="M12 22L18.5 22C20.433 22 22 20.433 22 18.5C22 17.3 21.4 16.25 20.5 15.65"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.8, delay: 0.7 },
          opacity: { duration: 0.3, delay: 0.7 },
        }}
      />

      <motion.path
        d="M14.5 16L18.5 16C19.33 16 20 16.67 20 17.5C20 18.33 19.33 19 18.5 19L14.5 19L14.5 16Z"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 1,
          ease: "backOut",
        }}
      />

      {/* Shimmer effect on bottom curve */}
      <motion.path
        d="M14.5 16L18.5 16C19.33 16 20 16.67 20 17.5C20 18.33 19.33 19 18.5 19L14.5 19L14.5 16Z"
        fill="currentColor"
        opacity="0.5"
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: [20, 20],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 2.5,
          ease: "easeInOut",
        }}
      />

      {/* Pulsing accent dots around the B */}
      <motion.circle
        cx="11"
        cy="10"
        r="1"
        fill="currentColor"
        opacity="0.6"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.8, 0.6],
        }}
        transition={{
          duration: 1,
          delay: 1.2,
        }}
      >
        <motion.animate
          attributeName="opacity"
          dur="2s"
          repeatCount="indefinite"
        />
      </motion.circle>

      <motion.circle
        cx="21"
        cy="16"
        r="1"
        fill="currentColor"
        opacity="0.6"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.8, 0.6],
        }}
        transition={{
          duration: 1,
          delay: 1.4,
        }}
      >
        <motion.animate
          attributeName="opacity"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </motion.circle>

      <motion.circle
        cx="11"
        cy="22"
        r="1"
        fill="currentColor"
        opacity="0.6"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.8, 0.6],
        }}
        transition={{
          duration: 1,
          delay: 1.6,
        }}
      >
        <motion.animate
          attributeName="opacity"
          dur="2s"
          begin="1s"
          repeatCount="indefinite"
        />
      </motion.circle>

      {/* Continuous floating particles */}
      <motion.circle
        cx="16"
        cy="8"
        r="0.5"
        fill="currentColor"
        opacity="0.4"
        animate={{
          y: [0, -5, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="10"
        cy="16"
        r="0.5"
        fill="currentColor"
        opacity="0.4"
        animate={{
          x: [-3, 0, -3],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="22"
        cy="16"
        r="0.5"
        fill="currentColor"
        opacity="0.4"
        animate={{
          x: [3, 0, 3],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.5,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="16"
        cy="24"
        r="0.5"
        fill="currentColor"
        opacity="0.4"
        animate={{
          y: [0, 5, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  )
}

export default BlogLogo