'use client'

import { motion } from 'framer-motion'
import { useHoverAnimations } from '@/app/hooks/useAnimations'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  onClick?: () => void
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  onClick 
}: AnimatedCardProps) {
  const { isHovered, hoverProps } = useHoverAnimations()
  
  return (
    <motion.div
      {...hoverProps}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: 'easeOut'
      }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow ${
        isHovered ? 'shadow-lg border-blue-200' : ''
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
