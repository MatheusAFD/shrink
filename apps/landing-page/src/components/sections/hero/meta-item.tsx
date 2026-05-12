export function MetaItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
