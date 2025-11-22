'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { animationVariants } from '@/app/hooks/useAnimations'

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [previousPathname, setPreviousPathname] = useState<string | null>(null)

  // Determine direction based on path changes
  useEffect(() => {
    if (previousPathname) {
      const pathDepth = pathname.split('/').length
      const prevPathDepth = previousPathname.split('/').length
      
      if (pathDepth > prevPathDepth) {
        setDirection('forward')
      } else if (pathDepth < prevPathDepth) {
        setDirection('backward')
      } else {
        // Compare paths alphabetically for same depth
        setDirection(pathname > previousPathname ? 'forward' : 'backward')
      }
    }
    setPreviousPathname(pathname)
  }, [pathname, previousPathname])

  // Unique key for page transitions
  const pageKey = `${pathname}?${searchParams.toString()}`

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        variants={animationVariants.pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
