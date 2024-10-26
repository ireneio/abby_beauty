import Image from "next/image"

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
      <Image
        src='/images/logo_rect.png'
        alt="logo"
        width={160}
        height={72}
        className="object-contain"
      />
      <h1 className="hidden">艾比美容中心</h1>
    </div>
  )
}
