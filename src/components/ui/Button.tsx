import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const button = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-[#1b6aa2]',
        outline: 'border border-border bg-white text-gray-800 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
      },
      size: { sm: 'h-8 px-3', md: 'h-10 px-4', lg: 'h-11 px-6' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>
export default function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
