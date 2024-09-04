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
import { Footer } from '@/components/client/Footer'
import { Logo } from '@/components/client/Logo'
import LineFloatButton from '../client/LineFloatButton'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'

import "react-multi-carousel/lib/styles.css";

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
  trials,
}: {
  panelId: string
  icon: React.ComponentType<{ className?: string }>
  expanded: boolean
  onToggle: () => void
  toggleRef: React.RefObject<HTMLButtonElement>
  invert?: boolean
  productTypes: any[]
  trials: any[]
}) {
  const router = useRouter()
  let { logoHovered, setLogoHovered } = useContext(RootLayoutContext)!

  return (
    <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
      <div className='flex items-center gap-12'>
        <Link
          href="/"
          aria-label="首頁"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <Logo
            className="hidden h-8 sm:block"
            invert={invert}
            filled={logoHovered}
          />
        </Link>
        {/* navigation */}
        <div className='hidden lg:flex h-full gap-x-8'>
          <div className='relative group'>
            <div className='cursor-pointer flex items-center hover:opacity-[0.75] py-4'>
              <div className='text-sm text-secondary'>預約體驗課程</div>
              <div>
                <ChevronDownIcon className='text-secondary w-[20px] h-[20px]' />
              </div>
            </div>
            <div className='text-secondary text-xs opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-12 left-0 min-w-[200px] bg-white shadow-lg border border-gray-200 transition-opacity duration-200'>
                {trials.map((trial: any) => {
                  return (
                    <div
                      key={trial.id}
                      onClick={() => router.push(`/trial/${trial.slug}`)}
                      className='py-2 px-2 cursor-pointer hover:opacity-[0.75]'
                    >
                      {trial.title_short}
                    </div>
                  )
                })}
            </div>
          </div>
          {/* <div className='cursor-pointer hover:opacity-[0.75] py-4' onClick={() => router.push('/articles')}>
            <div className='text-sm text-secondary'>最新消息</div>
          </div> */}
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
  )
}

function NavigationRow({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={clsx("sm:bg-primary border-b border-b-[#ccc]", className)}>
      <div className="grid grid-cols-1">{children}</div>
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
        className="px-6 text-secondary-dark group relative isolate bg-primary py-4 mt-px sm:mx-0 sm:even:border-l sm:even:border-[#ccc] sm:even:pl-16"
      >
        {children}
      </Link>
    )
  }
  return (
    <div onClick={() => onClick && onClick()} className='px-6 text-secondary-dark group relative isolate bg-primary py-4 mt-px sm:mx-0 sm:even:border-l sm:even:border-[#ccc] sm:even:pl-16'>
      {children}
    </div>
  )
}

function Navigation({ productTypes, trials }: { productTypes: any[], trials: any[] }) {
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
    <nav className="border-t border-t-[#ccc] max-h-[calc(100vh-112px)] overflow-auto font-display text-md font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/">首頁</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem onClick={() => handleSetExpand(1)}>
          <div className='flex justify-between'>
            預約體驗課程
            <ChevronDownIcon className={clsx('w-[24px]', !expandedIndexList.includes(1) ? 'block' : 'hidden')} />
            <ChevronUpIcon className={clsx('w-[24px]', expandedIndexList.includes(1) ? 'block' : 'hidden')} />
          </div>
        </NavigationItem>
      </NavigationRow>
      <div className={clsx('bg-primary text-secondary', expandedIndexList.includes(1) ? 'block' : 'hidden')}>
        {trials.map((trial: any) => {
          return (
            <div
              key={trial.id}
              className='border-b border-b-[#ccc] cursor-pointer px-10 py-2 hover:opacity-[0.75]'
              onClick={() => router.push(`/trial/${trial.slug}`)}
            >{trial.title_short}</div>
          )
        })}
      </div>
      {/* <NavigationRow>
        <NavigationItem href="/articles">最新消息</NavigationItem>
      </NavigationRow> */}
      <NavigationRow>
        <NavigationItem href="/classes">課程介紹</NavigationItem>
      </NavigationRow>
      <NavigationRow>
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
          className='border-b border-b-[#ccc] cursor-pointer px-6 py-2 hover:opacity-[0.75]'
          onClick={() => router.push(`/products`)}
        >
          全系列產品
        </div>
        {productTypes.map((productType: any) => {
          return (
            <div
              key={productType.id}
              className='border-b border-b-[#ccc] cursor-pointer px-10 py-2 hover:opacity-[0.75]'
              onClick={() => router.push(`/product/series/${productType.id}`)}
            >{productType.name}</div>
          )
        })}
      </div>
      <div className='h-8 w-full bg-primary'></div>
    </nav>
  )
}

function RootLayoutInner({ children, data }: { children: React.ReactNode, data: any }) {
  let panelId = useId()
  let [expanded, setExpanded] = useState(false)
  let openRef = useRef<React.ElementRef<'button'>>(null)
  let closeRef = useRef<React.ElementRef<'button'>>(null)
  let navRef = useRef<React.ElementRef<'div'>>(null)
  let shouldReduceMotion = useReducedMotion()

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

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <header className='fixed top-0 left-0 z-[2] w-full'>
        <div
          className="bg-white absolute left-0 right-0 top-0 lg:top-0 z-40 pt-0 pb-0 shadow-md"
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
            productTypes={data.productTypes}
            trials={data.trials}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '1px' }}
          className={clsx("lg:hidden relative z-50 overflow-hidden", expanded ? 'bg-primary' : 'bg-white')}
          aria-hidden={expanded ? undefined : 'true'}
          // @ts-ignore (https://github.com/facebook/react/issues/17157)
          inert={expanded ? undefined : ''}
        >
          <motion.div layout>
            <div ref={navRef} className="bg-primary">
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
                productTypes={data.productTypes}
                trials={data.trials}
              />
            </div>
            <Navigation
              trials={data.trials}
              productTypes={data.productTypes}
            />
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        className="relative flex flex-auto overflow-hidden bg-white pt-[72px] lg:pt-[72px]"
      >
        <motion.div
          layout
          className="relative isolate flex w-full flex-col pt-0"
        >
          <main className="w-full flex-auto max-w-7xl mx-auto mt-4">
            {children}
          </main>
          <Footer />
          <LineFloatButton />
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

// let hasInitialized = false

export function RootLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let [logoHovered, setLogoHovered] = useState(false)

  const { api } = useApi()
  const [productTypes, setProductTypes] = useState<any[]>([])
  const [trials, setTrials] = useState<any[]>([])

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

  const getTrials = async () => {
    const res = await api({
      method: 'GET',
      url: '/client/trials'
    })
    if (res.code === 0) {
      setTrials(res.data)
    } else {
      setTrials([])
    }
  }

  useEffect(() => {
    // if (!hasInitialized) {
      // hasInitialized = true
      Promise.all([
        getProductTypes(),
        getTrials()
      ])
    // }
  }, [])

  return (
    <RootLayoutContext.Provider value={{ logoHovered, setLogoHovered }}>
      <RootLayoutInner key={pathname} data={{ trials, productTypes }}>{children}</RootLayoutInner>
    </RootLayoutContext.Provider>
  )
}
