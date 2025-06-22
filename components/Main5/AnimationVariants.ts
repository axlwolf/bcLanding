// Animation variants for staggered animations
export const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

export const fadeIn = (
  direction = 'up',
  type: 'tween' | 'spring' | 'inertia' | 'keyframes' = 'spring',
  delay = 0,
  duration = 0.6
) => {
  let x = 0
  let y = 0

  switch (direction) {
    case 'left':
      x = 100
      break
    case 'right':
      x = -100
      break
    case 'up':
      y = 100
      break
    case 'down':
      y = -100
      break
    default:
      break
  }

  return {
    hidden: {
      x,
      y,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type,
        delay,
        duration,
        ease: 'easeInOut' as const,
      },
    },
  }
}

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 20,
    },
  },
}

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}
