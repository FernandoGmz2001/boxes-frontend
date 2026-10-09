import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface TableActionButtonProps extends ComponentProps<typeof Button> {
  label: string
  children: ReactNode
}

export default function TableActionButton({ label, children, ...props }: TableActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} {...props} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
