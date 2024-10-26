import Link from 'next/link'

import { Container } from '@/components/client/Container'
import { FadeIn } from '@/components/client/FadeIn'
import { Logo } from '@/components/client/Logo'
import { MapPinIcon } from '@heroicons/react/16/solid'
import openLineAtAccount from '@/lib/utils/openLineAtAccount'
import { useRouter } from 'next/router'

export function Footer() {
  const router = useRouter()
  return (
    <footer className="mt-4 md:mt-8 w-full bg-primary">
      {/* <FadeIn> */}
        {/* <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <Navigation />
          <div className="flex lg:justify-end">
            <NewsletterForm />
          </div>
        </div> */}
        <div>
          <div className="max-w-7xl mx-auto mb-8 px-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-8">
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8'>
              {/* <Link href="/" aria-label="Home"> */}
              <div>
                <Logo className="h-8" fillOnHover />
              </div>
              {/* </Link> */}
              <div>
                <div className='mb-4 text-primary-darkest'>關於我們</div>
                <div className='flex items-center gap-2'>
                  <MapPinIcon className='text-secondary w-[24px] h-[24px]' />
                  <div className='text-secondary text-sm'>新北市板橋區</div>
                </div>
              </div>
              <div>
                <div className='mb-4 text-primary-darkest'>追蹤我們</div>
                <div className='flex items-center gap-2' onClick={() => openLineAtAccount()}>
                  <img src="/images/logo_line.png" className='ml-[2px] w-[32px] h-[32px]' />
                </div>
              </div>
              <div>
                <div className='text-primary-darkest cursor-pointer hover:underline' onClick={() => router.push('/articles')}>最新消息</div>
              </div>
              <div>
                <div className='text-primary-darkest cursor-pointer hover:underline' onClick={() => router.push('/joinus')}>加入我們</div>
              </div>
            </div>
          </div>
          <div className="pt-4 text-sm text-secondary border-t border-neutral-950/10 mb-4 font-normal">
            <div className='max-w-7xl mx-auto'>
              <div className='px-8'>
                © Abby Beauty. {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      {/* </FadeIn> */}
    </footer>
  )
}
