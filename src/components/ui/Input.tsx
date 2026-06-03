import { cn } from '@/utils/cn'
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30',
        props.className
      )}
    />
  )
}
