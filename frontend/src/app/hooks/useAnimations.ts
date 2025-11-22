import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedLayoutProps {
  children: ReactNode
  className?: string
}

export const AnimatedLayout = ({ children, className = '' }: AnimatedLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
