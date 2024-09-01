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
import openLineAtAccount, { lineAccountHandle } from "@/lib/utils/openLineAtAccount";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await api(defaultInstance, {
    method: 'GET',
    url: '/client/home'
  })
  if (res.code === 0) {
    return {
      props: {
        banners: res.data.banners,
        services: res.data.services,
        trials: res.data.trials,
        brands: res.data.brands,
        customer_comments: res.data.customer_comments,
        joinus: res.data.joinus,
      }
    }
  }
  
  return {
    props: {
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
  }
};

type Props = any

export default function Home(props: Props) {
  const { banners, services, trials, customer_comments, brands, joinus } = props
  const router = useRouter()  

  // const [features] = useState<any[]>([
  //   {
  //     id: '1',
  //     name: '意猶未盡~沉浸式木質深層精油舒壓+客製化課程四選一',
  //     time: '80分鐘',
  //     text: '背部掌壓放鬆 + 精油純手技深層肌肉平衡釋壓按摩 60分 (使用森活木質調植物精油) (以下 4 選 1)',
  //     options: [
  //       {
  //         id: 'a',
  //         name: '九微米能量輕盈曲線 (臀部/手臂/大小腿 三選二) 20分',
  //       },
  //       {
  //         id: 'b',
  //         name: '溫和杏仁上背嫩白角質按摩 20分',
  //       },
  //       {
  //         id: 'c',
  //         name: '背部肌肉加強深層熱感放鬆 20分',
  //       },
  //       {
  //         id: 'd',
  //         name: '腹部暖宮SPA 10分 + 海藻美白曲線敷泥搭配專業P膜 10分',
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     name: '誰做誰美~痘痘肌掃油、肌膚乾燥缺水必選！頂級植萃臉部急救呵護課程',
  //     time: '90分鐘 (手技80分鐘)',
  //     text: '背部掌壓放鬆 + 精油純手技深層肌肉平衡釋壓按摩 60分 (使用森活木質調植物精油)',
  //     options: [
  //       {
  //         id: 'a',
  //         name: '課程說明',
  //       },
  //       {
  //         id: 'b',
  //         name: '天然胺基酸弱酸溫和卸妝',
  //       },
  //       {
  //         id: 'c',
  //         name: '甘草精萃深層潔顏',
  //       },
  //       {
  //         id: 'd',
  //         name: '甦活新肌去角質',
  //       },
  //       {
  //         id: 'e',
  //         name: '奈米小分子熱蒸',
  //       },
  //       {
  //         id: 'f',
  //         name: '專業美容師粉刺痘痘技術淨化處理',
  //       },
  //       {
  //         id: 'g',
  //         name: '植萃掃油平衡精華/特研植物性保濕 二選一',
  //       },
  //       {
  //         id: 'h',
  //         name: '冰晶肌底導入 (依膚況由專業美容師挑選)',
  //       },
  //       {
  //         id: 'i',
  //         name: '臉部SPA賦活按摩',
  //       },
  //       {
  //         id: 'j',
  //         name: '頂級松藻精粹光透白保濕面膜 (同時進行頭部舒刮 10分)',
  //       },
  //       {
  //         id: 'k',
  //         name: '肌底保養',
  //       },
  //       {
  //         id: 'l',
  //         name: '課後休憩熱茶',
  //       },
  //     ]
  //   }
  // ])
  
  
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
        <div className="md:hidden">
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
                  />
                </div>
              )
            })}
          </CarouselBanner>
        </div>
        <div className="px-4">
          <div className="hidden md:block">
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
                      src={banner.image_desktop}
                      alt={banner.id}
                      // layout="responsive"
                      width={1920}
                      height={800}
                      className="aspect-[2/1] object-contain"
                    />
                  </div>
                )
              })}
            </CarouselBanner>
          </div>
          <div className="mt-4">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              <div className="font-['BakudaiMedium']">
                艾比美容工作室
              </div>
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">about ab</div>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                {services.map((service: any) => {
                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        if (service.url) {
                          window.open(service.url, service.url_open_type)
                        }
                      }}
                    >
                      <div className="mb-4 flex justify-center">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover aspect-[1/1] rounded-xl"
                        />
                      </div>
                      <div className="text-center text-md font-medium tracking-[3px]">{service.title}</div>
                      <div className="mt-2 text-sm text-secondary leading-[36px] font-light tracking-[1.5px]">{service.content}</div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-8 flex justify-center">
                <Button onClick={() => openLineAtAccount()}>
                  預約諮詢
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              體驗課程
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">featured sessions</div>
            </div>
            <div className="mt-8">
              <div className="hidden md:block">
                <CarouselTrials>
                  {trials.map((trial: any) => {
                      return (
                        <div key={trial.id}>
                          <div className="w-full shadow-md" onClick={() => router.push(`/trial/${trial.slug}`)}>
                            <Image
                              src={trial.image}
                              alt={trial.title_short}
                              width={120}
                              height={120}
                              className="object-contain w-full aspect-[1/1]"
                            />
                          </div>
                          <h4 className="truncate mt-4">{trial.title_short}</h4>
                          <div>
                            <div className="text-danger text-xl lg:text-2xl">NT${formatNumberToMoney(trial.price_discount)}</div>
                            <div className="line-through text-gray-400">NT${formatNumberToMoney(trial.price_original)}</div>
                          </div>
                        </div>
                      )
                    })}
                </CarouselTrials>
              </div>
              <div className="md:hidden grid grid-cols-2 gap-8">
                {trials.map((trial: any) => {
                  return (
                    <div key={trial.id}>
                      <div className="w-full shadow-md" onClick={() => router.push(`/trial/${trial.slug}`)}>
                        <Image
                          src={trial.image}
                          alt={trial.title_short}
                          width={120}
                          height={120}
                          className="object-contain w-full aspect-[1/1]"
                        />
                      </div>
                      <h4 className="truncate mt-4">{trial.title_short}</h4>
                      <div className="flex items-end justify-start gap-1">
                        <div className="text-danger text-lg lg:text-2xl">NT${formatNumberToMoney(trial.price_discount)}</div>
                        <div className="line-through text-gray-400">NT${formatNumberToMoney(trial.price_original)}</div>
                      </div>
                    </div>
                  )
                })}
                {/* {features.map((feature) => {
                  return (
                    <div key={feature.id} className="shadow-md rounded-md">
                      <div className="min-h-[80px] px-4 pt-4 bg-secondary font-medium text-primary text-md pb-4 rounded-tl-md rounded-tr-md">{feature.name}</div>
                      <div className="px-4 font-light mt-4 text-sm text-secondary">{feature.time}</div>
                      <div className="px-4 mt-4 font-semibold text-md leading-[24px] text-secondary">{feature.text}</div>
                      <div className="border-t border-t-[#ccc] mx-4 pt-4 pb-4 mt-4 space-y-4 text-secondary">
                        {feature.options.map((option: any) => {
                          return (
                            <div key={option.id} className="flex gap-1 text-sm">
                              <div>•</div>
                              <div>{option.name}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })} */}
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => openLineAtAccount()}>
                馬上預約體驗
              </Button>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              客戶好評
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">customer comments</div>
            </div>
            <div className="mt-8">
              <CarouselComments>
                {customer_comments.map((comment: any) => {
                  return (
                    <div key={comment.id} className="px-4 py-4 shadow-md rounded-md h-full mr-4">
                      <div className="flex gap-4 items-center">
                        <img
                          className="rounded-full w-[48px] h-[48px] object-cover"
                          src={comment.avatar}
                          alt={comment.customer_name}
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
                      <div className="mt-4 text-sm text-secondary tracking-[1.5px] leading-[24px]">
                        {comment.content}
                      </div>
                    </div>
                  )
                })}
              </CarouselComments>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              品牌價值
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">branding</div>
            </div>
            <div className="mt-8">
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-4">
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
          <div className="mt-12">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              加入我們
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">join us</div>
            </div>
            <div className="mt-12 md:hidden w-full h-[1px] bg-[#ccc]"></div>
            <div className="lg:flex lg:gap-12">
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
        </div>
      </RootLayout>
    </>
  );
}
