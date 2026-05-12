import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, BrowsersIcon, PuzzleIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

type Props = {
  align?: 'left' | 'center'
}

export function CtaButtons({ align = 'left' }: Props) {
  const router = useRouter()
  const installHref = router.buildLocation({ to: '/install' }).href

  return (
    <div
      className={cn(
        'flex flex-wrap gap-3',
        align === 'center' && 'justify-center'
      )}
    >
      <Button
        as="a"
        href={installHref}
        variant="primary"
        size="lg"
        leadingIcon={<PuzzleIcon size={16} />}
        trailingIcon={<ArrowRightIcon size={16} />}
      >
        Install from source
      </Button>
      <Button
        as="a"
        href={installHref}
        variant="secondary"
        size="lg"
        leadingIcon={<BrowsersIcon size={16} />}
      >
        Chrome &amp; Firefox guide
      </Button>
    </div>
  )
}
