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
        src='/images/logo.png'
        alt="logo"
        className='w-[72px] h-[72px] object-contain'
      />
      <h1 className="text-md md:text-sm font-semibold tracking-[1.5px] font-['BakudaiMedium']">
        克麗緹娜
        <br/>
        艾比美容工作室
      </h1>
    </div>
  )
}
