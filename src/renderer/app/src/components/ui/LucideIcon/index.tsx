import React from 'react'
import { icons } from 'lucide-react'
import { COLOR_PALETTE } from '../../../utils/constants'

interface LucideIconProps {
  name: string
  color?: string
  size?: number
}

const LucideIcon: React.FC<LucideIconProps> = ({
  name,
  size = 16,
  color = COLOR_PALETTE.ICON_COLOR
}) => {
  const Icon = icons[name]

  return <Icon color={color} size={size} />
}

export default LucideIcon
