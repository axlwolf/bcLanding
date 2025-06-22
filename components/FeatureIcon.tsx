import { getIconComponent } from '@/lib/utils/iconMap'
import { HiOutlineSparkles } from 'react-icons/hi2'

const FeatureIcon = ({ icon, size = '6' }: { icon: string; size?: string }) => {
  const IconComponent = getIconComponent(icon)
  if (!IconComponent) {
    console.warn(`Icon ${icon} not found in iconMap`)
    return (
      <HiOutlineSparkles className={`w-${size} h-${size} text-primary-600 dark:text-primary-400`} />
    )
  }
  return <IconComponent className={`text-primary-500 h-${size} w-${size}`} />
}

export default FeatureIcon
