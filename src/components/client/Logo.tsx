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
        src='/images/CHLITINA 艾比美容中心.png'
        className="h-[72px] object-contain"
      />
    </div>
  )
}
