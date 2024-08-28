import Link from 'next/link'

import { Container } from '@/components/client/Container'
import { FadeIn } from '@/components/client/FadeIn'
import { Logo } from '@/components/client/Logo'
import { MapPinIcon } from '@heroicons/react/16/solid'
import openLineAtAccount from '@/lib/utils/openLineAtAccount'

export function Footer() {
  return (
    <Container as="footer" className="mt-24 w-full sm:mt-32 lg:mt-40">
      <FadeIn>
        {/* <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          <Navigation />
          <div className="flex lg:justify-end">
            <NewsletterForm />
          </div>
        </div> */}
        <div className="mb-8 mt-24 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-neutral-950/10 pt-8">
          <div className='space-y-4 md:space-y-2 md:flex gap-x-12'>
            <Link href="/" aria-label="Home">
              <Logo className="h-8" fillOnHover />
            </Link>
            <div className='space-y-2 md:mt-2'>
              <div className='flex items-center gap-2'>
                <MapPinIcon className='text-secondary w-[24px] h-[24px]' />
                <div className='text-secondary text-sm'>新北市板橋區</div>
              </div>
              <div className='flex items-center gap-2' onClick={() => openLineAtAccount()}>
                <img src="/images/logo_line.png" className='ml-[2px] w-[20px] h-[20px]' />
                <div className='text-secondary text-sm'>@672bkaxq</div>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-8 text-sm text-neutral-700 border-t border-neutral-950/10 mb-20">
          © Abby Beauty. {new Date().getFullYear()}
        </p>
      </FadeIn>
    </Container>
  )
}
