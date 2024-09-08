import { Button } from "@/components/client/Button";
import CarouselBanner from "@/components/client/home/CarouselBanner";
import CarouselComments from "@/components/client/home/CarouselComments";
import CarouselTrials from "@/components/client/home/CarouselTrials";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import { defaultInstance } from "@/lib/hooks/useApi";
import formatTextareaContent from "@/lib/store/formatTextareaContent";
import formatNumberToMoney from "@/lib/utils/formatNumberToMoney";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from 'framer-motion'

export const getStaticProps: GetStaticProps = async () => {
  let props = {
    banners: [],
      services: [],
      trials: [],
      brands: [],
      customer_comments: [],
      joinus: {
        id: '',
        image: '',
        content: '',
      },
  }
  const res = await api(defaultInstance, {
    method: 'GET',
    url: '/client/home'
  })
  if (res.code === 0) {
    props = {
      banners: res.data.banners,
      services: res.data.services,
      trials: res.data.trials,
      brands: res.data.brands,
      customer_comments: res.data.customer_comments,
      joinus: res.data.joinus,
    }
  }
  
  return {
    props,
    revalidate: 10,
  }
};

type Props = any

export default function Home(props: Props) {
  const { banners, services, trials, customer_comments, brands, joinus } = props
  const router = useRouter()

  const [flippedServices, setFlippedServices] = useState<number[]>([])

  const handleFlipService = (index: number) => {
    if (flippedServices.includes(index)) {
      setFlippedServices((prev) => {
        return prev.filter((v) => v !== index)
      })
    } else {
      setFlippedServices((prev) => {
        return [...prev, index]
      })
    }
  }

  return (
    <>
      <Head>
          <title>{seoDefault.title}</title>
          <meta name="description" content={seoDefault.description} />
          <meta property="og:title" content={seoDefault.title} />
          <meta property="og:description" content={seoDefault.description} />
          <meta property="og:image" content={seoDefault.image} />
          <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={seoDefault.site_name} />
          <meta property="twitter:card" content={seoDefault.image} />
          <meta name="twitter:title" content={seoDefault.title} />
          <meta name="twitter:description" content={seoDefault.description} />
          <meta property="twitter:image" content={seoDefault.image} />
          {/* <meta name="twitter:site" content="@yourtwitterhandle" />
          <meta name="twitter:creator" content="@creatorhandle" /> */}
      </Head>
      <RootLayout>
        <div className="md:hidden mt-[-1rem] pb-4">
          <CarouselBanner>
            {banners.map((banner: any) => {
              return (
                <div
                  key={banner.id}
                  onClick={() => {
                    if (banner.url) {
                      window.open(banner.url, banner.url_open_type)
                    }
                  }}
                >
                  <Image
                    src={banner.image_mobile}
                    alt={banner.id}
                    width={900}
                    height={1200}
                    // layout="responsive"
                    className="object-contain"
                    priority={true}
                  />
                </div>
              )
            })}
          </CarouselBanner>
        </div>
        <div className="hidden md:block mt-[-1rem] pb-4">
          <CarouselBanner>
            {banners.map((banner: any) => {
              return (
                <div
                  key={banner.id}
                  onClick={() => {
                    if (banner.url) {
                      window.open(banner.url, banner.url_open_type)
                    }
                  }}
                  className="flex justify-center"
                >
                  <Image
                    src={banner.image_desktop}
                    alt={banner.id}
                    width={1900}
                    height={800}
                    className="aspect-[19/8] object-contain"
                    priority={true}
                  />
                </div>
              )
            })}
          </CarouselBanner>
        </div>
        <div
          className="bg-primary py-8 bg-[url(/images/about_us_bg.jpg)] bg-cover bg-no-repeat bg-center"
          style={{ backgroundSize: '130%' }}
        >
          <div className="max-w-7xl mx-auto md:grid md:grid-cols-6">
            <div className="md:col-span-4">
              <div className="flex items-end gap-4 px-8">
                <div className="text-primary-darkest text-3xl font-normal">關於我們</div>
                <div className="w-[4px] h-[28px] bg-primary-darker mb-[4px]"></div>
                <div className="mt-2 text-primary-darkest text-xl font-normal uppercase flex items-center">
                  about us
                </div>
              </div>
              <div className="mt-8 max-w-7xl mx-auto px-8 text-primary-darker leading-[36px]">
                我們使用克麗緹娜產品提供專業級的臉部護理、身體護理、臉部撥筋等服務。在課程中，我們會根據您的膚況調配最適合、有效的配方，且絕對不進行產品與課程的推銷。
              </div>
            </div>
            <div className="mt-8 px-8 md:mt-0 md:col-span-2">
              <Image
                src={"/images/about_us_1.jpg"}
                alt="關於我們"
                width={1000}
                height={1000}
                className="w-full aspect-[1/1] object-cover rounded-tl-[64px] rounded-br-[64px]"
              />
            </div>
          </div>
        </div>
        <div className="py-8 bg-primary-darker">
          <div className="text-center px-4 xl:px-0 max-w-7xl mx-auto text-2xl text-primary font-normal tracking-[1.5px] pb-8">
            服務項目
            <div className="mt-2 text-xl tracking-[3px] font-normal uppercase">our services</div>
          </div>
          <div>
            <div className="px-4 xl:px-0 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              {services.map((service: any, index: number) => {
                return (
                  <div
                    key={service.id}
                    className={clsx("flip-card-container", flippedServices.includes(index) ? 'flipped' : '')}
                  >
                    <div className="card w-full aspect-[1/1]">
                      <div
                        className="front absolute flex justify-center"
                        onClick={() => handleFlipService(index)}
                      >
                        <div>
                          <img
                            src={service.image}
                            alt={service.title}
                            className="object-cover aspect-[1/1] rounded-xl opacity-[0.75]"
                          />
                        </div>
                        <div className="text-nowrap flex gap-2 items-center text-primary-darker backdrop-blur-sm bg-white/70 px-4 py-2 rounded-md absolute bottom-4 left-4 text-center text-lg font-medium tracking-[3px]">
                          <div className="h-[18px] w-[6px] bg-primary-dark"></div>
                          {service.title}
                        </div>
                        <div
                          className="opacity-[0.75] cursor-pointer text-primary-darkest flex items-center gap-1 px-4 py-2 absolute bg-primary bottom-0 right-0 rounded-tl-xl rounded-br-xl"
                        >
                          服務介紹
                          <ArrowRightIcon className="w-[14px] h-[14px]" />
                        </div>
                      </div>
                      <div
                        className="back absolute cursor-pointer flex flex-col gap-y-4 bg-primary-darkest px-4 rounded-xl text-sm text-primary leading-[36px] font-normal tracking-[1.5px]"
                        onClick={() => handleFlipService(index)}
                      >
                        {service.content}
                        {service.url ?
                          <div
                            className="px-4 py-2 bg-primary-darker text-primary rounded-full cursor-pointer"
                            onClick={() => {
                              if (service.url) {
                                window.open(service.url, service.url_open_type)
                              }
                            }}
                          >瞭解更多</div> :
                          null
                        }
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* <div className="mt-8 flex justify-center">
              <Button onClick={() => openLineAtAccount()}>
                預約諮詢
              </Button>
            </div> */}
          </div>
        </div>
        <div className="pt-8 pb-8 bg-primary-dark">
          <div className="text-2xl text-center text-primary-darkest font-semibold tracking-[1.5px]">
            體驗課程
            <div className="text-xl mt-2 tracking-[3px] font-light uppercase">featured sessions</div>
          </div>
          <div className="mt-8 max-w-7xl mx-auto">
            <div className="px-4 hidden md:block bg-primary-dark">
              <CarouselTrials>
                {trials.map((trial: any) => {
                    return (
                      <div key={trial.id} className="h-full bg-white rounded-xl px-4 py-4 mr-8 shadow-md">
                        <div className="w-full shadow-md" onClick={() => router.push(`/trial/${trial.slug}`)}>
                          <Image
                            src={trial.image}
                            alt={trial.title_short}
                            width={180}
                            height={180}
                            className="object-contain w-full aspect-[1/1]"
                          />
                        </div>
                        <h4 className="mt-4">{trial.title_short}</h4>
                        <div>
                          <div className="text-danger text-xl">NT${formatNumberToMoney(trial.price_discount)}</div>
                          <div className="line-through text-gray-400">NT${formatNumberToMoney(trial.price_original)}</div>
                        </div>
                      </div>
                    )
                  })}
              </CarouselTrials>
            </div>
            <div className="px-4 md:hidden grid grid-cols-1 gap-8">
              {trials.map((trial: any) => {
                return (
                  <div key={trial.id} className="relative py-4 shadow-md bg-primary" onClick={() => router.push(`/trial/${trial.slug}`)}>
                    <div className="w-full">
                      <Image
                        src={trial.image}
                        alt={trial.title_short}
                        width={1200}
                        height={1200}
                        className="object-contain w-full aspect-[1/1]"
                      />
                    </div>
                    <div className="pt-4 pb-8 absolute left-[50%] translate-x-[-50%] bottom-[48px] bg-primary-darker bg-opacity-[0.9] px-4">
                      <h4 className="text-nowrap text-lg font-normal text-white">{trial.title_short}</h4>
                      <div className="flex items-end justify-end gap-1 mt-1">
                        <div className="text-primary text-md font-normal">體驗價 NT${formatNumberToMoney(trial.price_discount)}</div>
                        {/* <div className="mb-[3px] line-through text-gray-400 text-xs">NT${formatNumberToMoney(trial.price_original)}</div> */}
                      </div>
                    </div>
                    <div
                      className="w-[120px] h-[40px] border-aniamated-button shadow-md flex items-center justify-center gap-[2px] absolute left-[50%] bottom-[32px] translate-x-[-50%] bg-primary-darkest text-primary"
                    >
                      <svg width="120px" height="40px" viewBox="0 0 180 60" className="border absolute">
                        <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                        <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
                      </svg>
                      課程介紹
                      <ArrowRightIcon className="w-[14px] h-[14px]" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* <div className="mt-8 flex justify-center">
            <Button onClick={() => openLineAtAccount()}>
              馬上預約體驗
            </Button>
          </div> */}
        </div>
        <div className="py-8 bg-primary">
          <div className="text-2xl text-center text-secondary font-semibold tracking-[1.5px]">
            客戶好評
            <div className="text-xl mt-2 tracking-[3px] font-light uppercase">customer comments</div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 px-4">
            <CarouselComments>
              {customer_comments.map((comment: any) => {
                return (
                  <div key={comment.id} className="px-4 py-4 shadow-md rounded-md h-full mr-4 bg-white">
                    <div className="flex gap-4 items-center">
                      <Image
                        className="rounded-full w-[48px] h-[48px] object-cover"
                        src={comment.avatar}
                        alt={comment.customer_name}
                        width={48}
                        height={48}
                      />
                      <div>
                        <div className="text-xs text-secondary">{comment.customer_name}</div>
                        <div className="flex mt-[2px]">
                          {comment.stars && !isNaN(Number(comment.stars)) ?
                            Array(Number(comment.stars)).fill(0).map((v, i) => {
                              return (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="text-yellow-500 w-4 h-4"
                                >
                                  <path
                                    d="M12 2.5l2.09 6.26h6.58l-5.33 3.87 2.09 6.26L12 15.5l-5.33 3.87 2.09-6.26L3.43 8.76h6.58L12 2.5z"
                                  />
                                </svg>
                              )
                            }) : null}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-4 text-sm text-secondary tracking-[1.5px] leading-[24px]"
                      dangerouslySetInnerHTML={{ __html: formatTextareaContent(comment.content) }}
                    >
                    </div>
                  </div>
                )
              })}
            </CarouselComments>
          </div>
        </div>
        <div className="py-8">
          <div className="text-center text-2xl text-primary-darker font-semibold tracking-[1.5px]">
            品牌價值
            <div className="mt-2 text-xl tracking-[3px] font-light uppercase">branding</div>
          </div>
          <div className="max-w-7xl mx-auto mt-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4 px-4">
                {brands.map((brand: any) => {
                  return (
                    <div key={brand.id} className="mb-4 break-inside-avoid">
                      <Image
                        src={brand.image}
                        alt={brand.title}
                        width={1200}
                        height={900}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
        </div>
        <div className="hidden lg:block pt-8 pb-8 bg-primary/30">
          <div className="text-center text-2xl text-primary-darker font-semibold tracking-[1.5px]">
            加入我們
            <div className="mt-2 text-xl tracking-[3px] font-light uppercase">join us</div>
          </div>
          <div className="lg:flex lg:gap-12 px-4 max-w-7xl mx-auto">
            <div className="mt-12">
              <div className="flex justify-center shadow-md rounded-md">
                <div className="h-[150px] md:h-[300px]">
                  <Image
                    src={joinus.image}
                    alt="加入我們"
                    width={1920}
                    height={1080}
                    className="aspect-[16/9] object-contain px-4 md:px-0 h-[150px] md:h-[300px]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12">
              <div className="bg-primary px-8 py-8 shadow-md rounded-md">
                <div className="mt-0">
                  <div
                    className="font-light text-sm text-secondary leading-[36px] tracking-[1.5px]"
                    dangerouslySetInnerHTML={{ __html: formatTextareaContent(joinus.content) }}
                  >
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <Button onClick={() => openLineAtAccount()}>暸解更多</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden bg-primary/30">
          <div className="relative pt-8 pb-8 text-center text-2xl text-primary-darkest font-semibold tracking-[1.5px]">
              <Image
                src={"/images/join_us_bg.jpg"}
                alt="加入我們"
                width={1920}
                height={1080}
                className="absolute top-0 left-0 right-0 bottom-0 object-cover max-h-[100%] opacity-[0.33]"
              />
              加入我們
              <div className="mt-2 text-xl tracking-[3px] font-light uppercase">join us</div>
          </div>
          {/* <div className="mt-12 md:hidden w-full h-[1px] bg-[#ccc]"></div> */}
          <div className="lg:flex lg:gap-12">
            <div className="mt-8">
              <div className="px-8 pb-8">
                <div className="flex justify-center shadow-md rounded-md">
                  <div className="h-[150px] md:h-[300px]">
                    <Image
                      src={joinus.image}
                      alt="加入我們"
                      width={1920}
                      height={1080}
                      className="aspect-[16/9] object-contain px-4 md:px-0 h-[150px] md:h-[300px]"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <div
                    className="font-normal text-sm text-secondary leading-[36px] tracking-[1.5px]"
                    dangerouslySetInnerHTML={{ __html: formatTextareaContent(joinus.content) }}
                  >
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <Button onClick={() => openLineAtAccount()}>暸解更多</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RootLayout>
    </>
  );
}
