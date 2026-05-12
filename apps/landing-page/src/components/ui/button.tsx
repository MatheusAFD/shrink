import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<'button'>
type AnchorProps = CommonProps & ComponentPropsWithoutRef<'a'> & { as: 'a' }

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-mono font-medium transition focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent-strong hover:shadow-(--shadow-glow)',
  secondary:
    'border border-border-strong bg-transparent text-fg hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-fg-muted hover:bg-bg-elevated hover:text-fg'
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm'
}

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    children,
    className,
    ...rest
  } = props as CommonProps & {
    className?: string
    children?: ReactNode
  } & Record<string, unknown>

  const classes = cn(base, variants[variant], sizes[size], className)

  if ('as' in props && props.as === 'a') {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </a>
    )
  }

  return (
    <button
      className={classes}
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
}
