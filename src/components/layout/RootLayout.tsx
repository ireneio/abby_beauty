'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/client/Button'
import { Container } from '@/components/client/Container'
import { Footer } from '@/components/client/Footer'
import { GridPattern } from '@/components/client/GridPattern'
import { Logo, Logomark } from '@/components/client/Logo'
import { Offices } from '@/components/client/Offices'
import { SocialMedia } from '@/components/client/SocialMedia'
import openLineAtAccount from '@/lib/utils/openLineAtAccount'
import LineFloatButton from '../client/LineFloatButton'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { ArrowDownIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'

const RootLayoutContext = createContext<{
  logoHovered: boolean
  setLogoHovered: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z" />
      <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z" />
    </svg>
  )
}

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M2 6h20v2H2zM2 16h20v2H2z" />
    </svg>
  )
}

function Header({
  panelId,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
  invert = false,
  productTypes,
}: {
  panelId: string
  icon: React.ComponentType<{ className?: string }>
  expanded: boolean
  onToggle: () => void
  toggleRef: React.RefObject<HTMLButtonElement>
  invert?: boolean
  productTypes: any[]
}) {
  const router = useRouter()
  let { logoHovered, setLogoHovered } = useContext(RootLayoutContext)!

  return (
    // <Container>
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className='flex items-center gap-12'>
          <Link
            href="/"
            aria-label="Home"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <Logomark
              className="h-8 sm:hidden"
              invert={invert}
              filled={logoHovered}
            />
            <Logo
              className="hidden h-8 sm:block"
              invert={invert}
              filled={logoHovered}
            />
          </Link>
          <div className='hidden lg:flex h-full gap-x-8'>
            <div className='cursor-pointer hover:opacity-[0.75] py-4' onClick={() => router.push('/classes')}>
              <div className='text-sm text-secondary'>課程介紹</div>
            </div>
            <div className='relative group'>
              <div className='cursor-pointer flex items-center hover:opacity-[0.75] py-4'>
                <div className='text-sm text-secondary'>產品介紹</div>
                <div>
                  <ChevronDownIcon className='text-secondary w-[20px] h-[20px]' />
                </div>
              </div>
              <div className='text-secondary text-xs opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-12 left-0 min-w-[200px] bg-white shadow-lg border border-gray-200 transition-opacity duration-200'>
                <div className='py-2 px-2 cursor-pointer hover:opacity-[0.75]' onClick={() => router.push('/products')}>全系列產品</div>
                  {productTypes.map((productType: any) => {
                    return (
                      <div
                        key={productType.id}
                        onClick={() => router.push(`/product/series/${productType.id}`)}
                        className='py-2 px-2 cursor-pointer hover:opacity-[0.75]'
                      >
                        {productType.name}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-8">
          <Button onClick={() => openLineAtAccount()}>
            預約諮詢
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded ? 'true' : 'false'}
            aria-controls={panelId}
            className={clsx(
              'lg:hidden group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-neutral-950/10',
            )}
            aria-label="Toggle navigation"
          >
            <Icon
              className={clsx(
                'h-6 w-6',
                invert
                  ? 'fill-black group-hover:fill-neutral-200'
                  : 'fill-neutral-950 group-hover:fill-neutral-700',
              )}
            />
          </button>
        </div>
      </div>
    // </Container>
  )
}

function NavigationRow({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={clsx("even:mt-px sm:bg-[#f5f1eb] border-b border-b-[#ccc]", className)}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
      </Container>
    </div>
  )
}

function NavigationItem({
  href,
  children,
  onClick,
}: {
  href?: string
  children: React.ReactNode
  onClick?: () => any
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="text-[#484a49] group relative isolate -mx-6 bg-[#f5f1eb] px-6 py-4 mt-px sm:mx-0 sm:even:border-l sm:even:border-[#ccc] sm:even:pl-16"
      >
        {children}
        <span className="absolute inset-y-0 -z-10 w-screen bg-white opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
      </Link>
    )
  }
  return (
    <div onClick={() => onClick && onClick()} className='text-[#484a49] group relative isolate -mx-6 bg-[#f5f1eb] px-6 py-4 mt-px sm:mx-0 sm:even:border-l sm:even:border-[#ccc] sm:even:pl-16'>
      {children}
      <span className="absolute inset-y-0 -z-10 w-screen bg-white opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
    </div>
  )
}

function Navigation({ productTypes }: { productTypes: any[] }) {
  const router = useRouter()
  const [expandedIndexList, setExpandedIndexList] = useState<number[]>([])

  const handleSetExpand = (index: number) => {
    if (expandedIndexList.includes(index)) {
      setExpandedIndexList((prev) => prev.filter((v) => v !== index))
    } else {
      setExpandedIndexList((prev) => {
        return [...prev, index]
      })
    }
  }

  return (
    <nav className="font-display text-md font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/">首頁</NavigationItem>
        <NavigationItem href="/classes">課程介紹</NavigationItem>
        <NavigationItem onClick={() => handleSetExpand(0)}>
          <div className='flex justify-between'>
            產品介紹
            <ChevronDownIcon className={clsx('w-[24px]', !expandedIndexList.includes(0) ? 'block' : 'hidden')} />
            <ChevronUpIcon className={clsx('w-[24px]', expandedIndexList.includes(0) ? 'block' : 'hidden')} />
          </div>
        </NavigationItem>
      </NavigationRow>
      <div className={clsx('bg-primary text-secondary', expandedIndexList.includes(0) ? 'block' : 'hidden')}>
        <div
          className='border-b border-b-[#ccc] cursor-pointer px-8 py-2 hover:opacity-[0.75]'
          onClick={() => router.push(`/products`)}
        >
          全系列產品
        </div>
        {productTypes.map((productType: any) => {
          return (
            <div
              key={productType.id}
              className='border-b border-b-[#ccc] cursor-pointer px-8 py-2 hover:opacity-[0.75]'
              onClick={() => router.push(`/product/series/${productType.id}`)}
            >{productType.name}</div>
          )
        })}
      </div>
      {/* <div className='border-b-[1px] border-b-[#ccc]'></div> */}
    </nav>
  )
}

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  let panelId = useId()
  let [expanded, setExpanded] = useState(false)
  let openRef = useRef<React.ElementRef<'button'>>(null)
  let closeRef = useRef<React.ElementRef<'button'>>(null)
  let navRef = useRef<React.ElementRef<'div'>>(null)
  let shouldReduceMotion = useReducedMotion()

  const { api } = useApi()
  const [productTypes, setProductTypes] = useState<any[]>([])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('a')?.href === window.location.href
      ) {
        setExpanded(false)
      }
    }

    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [])

  const getProductTypes = async () => {
    const res = await api({
      method: 'GET',
      url: '/client/product_types'
    })
    if (res.code === 0) {
      setProductTypes(res.data)
    } else {
      setProductTypes([])
    }
  }

  useEffect(() => {
    getProductTypes()
  }, [])

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-4"
          aria-hidden={expanded ? 'true' : undefined}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? '' : undefined}
        >
          <Header
            panelId={panelId}
            icon={MenuIcon}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded)
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true }),
              )
            }}
            productTypes={productTypes}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-[#f5f1eb] pt-2"
          aria-hidden={expanded ? undefined : 'true'}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? undefined : ''}
        >
          <motion.div layout className="bg-[#ccc]">
            <div ref={navRef} className="bg-[#f5f1eb] pb-4 pt-4">
              <Header
                invert
                panelId={panelId}
                icon={XIcon}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded)
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true }),
                  )
                }}
                productTypes={productTypes}
              />
            </div>
            <Navigation productTypes={productTypes} />
            {/* <div className="relative bg-[#f5f1eb] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[#ccc]">
              <Container className='px-6 py-4'>
                <Button>
                  預約諮詢
                </Button>
              </Container>
            </div> */}
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-[calc(88px+12px)]"
      >
        <motion.div
          layout
          className="relative isolate flex w-full flex-col pt-0"
        >
          {/* <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={-96}
            interactive
          /> */}

          <main className="w-full flex-auto max-w-7xl mx-auto">
            {children}
          </main>

          <Footer />
          <LineFloatButton />
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let [logoHovered, setLogoHovered] = useState(false)

  return (
    <RootLayoutContext.Provider value={{ logoHovered, setLogoHovered }}>
      <RootLayoutInner key={pathname}>{children}</RootLayoutInner>
    </RootLayoutContext.Provider>
  )
}
