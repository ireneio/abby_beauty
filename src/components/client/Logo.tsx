export function Logo({
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
  fillOnHover?: boolean
}) {
  return (
    <div className='flex gap-4 items-center'>
      <img
        src='/images/logo_rect.png'
        className="h-[72px] object-contain"
      />
      <h1 className="hidden">艾比美容中心</h1>
    </div>
  )
}
