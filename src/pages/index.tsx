import { Button } from "@/components/client/Button";
import CarouselBanner from "@/components/client/home/CarouselBanner";
import CarouselComments from "@/components/client/home/CarouselComments";
import { Logo } from "@/components/client/Logo";
import { RootLayout } from "@/components/layout/RootLayout";
import openLineAtAccount, { lineAccountHandle } from "@/lib/utils/openLineAtAccount";
import { ArchiveBoxIcon, BookOpenIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [banners] = useState<any[]>([
    {
      id: '1',
      image: '/images/banners/戰痘達人_橫幅.jpg',
      image_mobile: '/images/banners/戰痘達人_直幅.jpg',
      url: `https://line.me/R/ti/p/${lineAccountHandle}`
    },
    {
      id: '2',
      image: '/images/banners/輕粉戰痘_橫幅.jpg',
      image_mobile: '/images/banners/輕粉戰痘_直幅.jpg',
      url: '/product/series/8'
    },
    {
      id: '3',
      image: '/images/banners/banner_1.jpg',
      image_mobile: '/images/banners/banner_mobile_1.jpg',
      url: '/product/series/3'
    },
    {
      id: '4',
      image: '/images/banners/banner_2.jpg',
      image_mobile: '/images/banners/banner_mobile_2.jpg',
      url: '/product/series/16'
    },
    {
      id: '5',
      image: '/images/banners/banner_3.jpg',
      image_mobile: '/images/banners/banner_mobile_3.jpg',
      url: '/product/series/2'
    },
  ])

  const [services] = useState<any[]>([
    {
      id: '1',
      image: '/images/service_1.jpg',
      name: '臉部護理',
      description: '我們專注於提供高品質的臉部護理服務，採用頂級產品與專業技術，為您的肌膚進行深層清潔與營養補充。無論是要對抗歲月痕跡，還是改善膚質，我們都能幫助您的臉龐恢復青春光彩，展現自然亮麗的膚色。',
    },
    {
      id: '2',
      image: '/images/service_2.jpg',
      name: '身體護理',
      description: '我們的身體護理服務則致力於為您帶來全身的舒適與放鬆。透過舒緩的按摩手法與滋養護理，針對不同需求進行量身定制，幫助您釋放壓力、改善皮膚質感，讓您在忙碌的生活中得到徹底的身心放鬆。',
    },
    {
      id: '3',
      image: '/images/service_3.jpg',
      name: '臉部撥筋服務',
      description: '我們使用水晶刮痧板來提供專業的臉部撥筋服務，臉部撥筋是一種專業的手法，通過深層按摩和經絡刺激來激活肌膚的自我修復機制，幫助緩解面部緊張、改善肌膚鬆弛、並有效提升面部輪廓、散發自然光澤。無論您希望達到抗衰老效果，還是單純享受深層放鬆，我們的臉部撥筋服務都能滿足您的需求。',
    },
    {
      id: '4',
      image: '/images/service_4.jpg',
      name: '修眉服務',
      description: '提供專業的修眉服務在臉部課程內皆有包含，另外也可以選購此項服務，將根據您的臉型和眉毛的自然生長方向，量身定制修眉服務不僅能提升您的整體面貌，還能讓您感受到舒適與放鬆。無論您喜歡自然的弧形還是更具線條感的造型，都能提供滿意的結果。',
    },
    // {
    //   id: '5',
    //   image: '/images/service_5.jpg',
    //   name: '刮痧服務',
    //   description: '我們提供專業的刮痧服務，致力於促進您的身體健康和放鬆。刮痧是一種傳統的中醫療法，通過刮拭皮膚來促進血液循環和舒緩肌肉緊張。我們的專業技術人員將根據您的需求和身體狀況，選擇合適的刮痧工具和手法，確保每一次療程都能帶來最佳的效果。無論您是希望緩解疲勞、改善睡眠還是促進新陳代謝，我們的刮痧服務都能幫助您達到身心的最佳狀態。',
    // },
    {
      id: '6',
      image: '/images/service_6.jpg',
      name: '美甲服務',
      description: '在我們美容工作室附設小型個人美甲區，提供高性價比的美甲服務，讓您以實惠的價格享受精緻的指尖護理。美甲師以熱情與細心著稱，專注於每一個細節，確保您在獲得理想效果的同時，感受到服務的價值。無論您想要簡約優雅的設計，還是個性化的創意美甲，我們都能以合理的價格為您實現。在這裡，您不僅能享受到價格划算的服務，更能體驗到高品質的美甲護理，讓您的雙手在不花大錢的情況下依然綻放光彩。',
    }
  ])

  const [features] = useState<any[]>([
    {
      id: '1',
      name: '意猶未盡~沉浸式木質深層精油舒壓+客製化課程四選一',
      time: '80分鐘',
      text: '背部掌壓放鬆 + 精油純手技深層肌肉平衡釋壓按摩 60分 (使用森活木質調植物精油) (以下 4 選 1)',
      options: [
        {
          id: 'a',
          name: '九微米能量輕盈曲線 (臀部/手臂/大小腿 三選二) 20分',
        },
        {
          id: 'b',
          name: '溫和杏仁上背嫩白角質按摩 20分',
        },
        {
          id: 'c',
          name: '背部肌肉加強深層熱感放鬆 20分',
        },
        {
          id: 'd',
          name: '腹部暖宮SPA 10分 + 海藻美白曲線敷泥搭配專業P膜 10分',
        }
      ]
    },
    {
      id: '2',
      name: '誰做誰美~痘痘肌掃油、肌膚乾燥缺水必選！頂級植萃臉部急救呵護課程',
      time: '90分鐘 (手技80分鐘)',
      text: '背部掌壓放鬆 + 精油純手技深層肌肉平衡釋壓按摩 60分 (使用森活木質調植物精油)',
      options: [
        {
          id: 'a',
          name: '課程說明',
        },
        {
          id: 'b',
          name: '天然胺基酸弱酸溫和卸妝',
        },
        {
          id: 'c',
          name: '甘草精萃深層潔顏',
        },
        {
          id: 'd',
          name: '甦活新肌去角質',
        },
        {
          id: 'e',
          name: '奈米小分子熱蒸',
        },
        {
          id: 'f',
          name: '專業美容師粉刺痘痘技術淨化處理',
        },
        {
          id: 'g',
          name: '植萃掃油平衡精華/特研植物性保濕 二選一',
        },
        {
          id: 'h',
          name: '冰晶肌底導入 (依膚況由專業美容師挑選)',
        },
        {
          id: 'i',
          name: '臉部SPA賦活按摩',
        },
        {
          id: 'j',
          name: '頂級松藻精粹光透白保濕面膜 (同時進行頭部舒刮 10分)',
        },
        {
          id: 'k',
          name: '肌底保養',
        },
        {
          id: 'l',
          name: '課後休憩熱茶',
        },
      ]
    }
  ])

  const [comments] = useState<any[]>([
    {
      id: '1',
      avatar: '/images/avatar_1.jpg',
      name: '小芸',
      text: '這家美容工作室真的超棒的！每次來都能感受到滿滿的放鬆和舒適感，服務人員非常專業且親切。我的皮膚狀況改善了不少，特別是那個面部護理，效果真的很驚豔！推薦給所有愛美的朋友們！',
    },
    {
      id: '2',
      avatar: '/images/avatar_2.jpg',
      name: '怡靜',
      text: '美容師非常細心，能夠根據個人膚質給出最適合的建議。每次做完療程後都感覺皮膚水嫩嫩的，變得更有光澤。工作室的環境也很乾淨、舒適，讓人有賓至如歸的感覺。值得再回來！',
    },
    {
      id: '3',
      avatar: '/images/avatar_3.jpg',
      name: '芯瑜',
      text: '我對這家美容工作室非常滿意！不僅僅是技術專業，更重要的是她們給予了非常貼心的服務。這次我做了身體護理，整個過程都讓人覺得很放鬆，而且效果顯著。強烈推薦給需要身體放鬆的人！',
    },
    {
      id: '4',
      avatar: '/images/avatar_4.jpg',
      name: '曉安',
      text: '非常喜歡這家美容工作室！每次來都感覺自己被細心呵護。美容師的技術讓我每次都能帶著滿意的笑容離開。特別推薦她們的光療課程，皮膚變得超亮、超滑。感謝她們的用心照顧！',
    },
    {
      id: '5',
      avatar: '/images/avatar_5.jpg',
      name: '小雪',
      text: '這家美容工作室真的讓我非常驚豔！每個人都很專業，並且會針對我的膚質給出最適合的建議。療程後皮膚變得更緊緻光滑，朋友們都說我變漂亮了！下次一定會再來做其他課程！',
    }
  ])

  return (
    <>
      <Head>
          <title>艾比美容工作室</title>
          <meta name="description" content={`艾比美容工作室 | 克麗緹娜`} />
          <meta property="og:title" content={"艾比美容工作室"} />
          <meta property="og:description" content={`艾比美容工作室 | 克麗緹娜`} />
          {/* <meta property="og:image" content={data.image_cover} /> */}
          <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="艾比美容工作室"/>
          {/* <meta name="twitter:card" content={data.image_cover} /> */}
          <meta name="twitter:title" content={"課程介紹"} />
          <meta name="twitter:description" content={`艾比美容工作室 | 克麗緹娜`} />
          {/* <meta name="twitter:image" content={data.image_cover} /> */}
          {/* <meta name="twitter:site" content="@yourtwitterhandle" />
          <meta name="twitter:creator" content="@creatorhandle" /> */}
      </Head>
      <RootLayout>
        <div className="px-4">
          <div className="md:hidden">
            <div className="">
              <CarouselBanner>
                {banners.map((banner) => {
                  return (
                    <div key={banner.id} onClick={() => router.push(banner.url)}>
                      <img
                        src={banner.image_mobile}
                        alt={banner.id}
                      />
                    </div>
                  )
                })}
              </CarouselBanner>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="">
              <CarouselBanner>
                {banners.map((banner) => {
                  return (
                    <div key={banner.id} onClick={() => router.push(banner.url)}>
                      <img
                        src={banner.image}
                        alt={banner.id}
                      />
                    </div>
                  )
                })}
              </CarouselBanner>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              <div className="font-['BakudaiMedium']">
                艾比美容工作室
              </div>
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">about ab</div>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                {services.map((service) => {
                  return (
                    <div key={service.id} onClick={() => router.push('/classes')}>
                      <div className="mb-4 flex justify-center">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="object-cover aspect-[1/1] rounded-xl"
                        />
                      </div>
                      <div className="text-center text-md font-medium tracking-[3px]">{service.name}</div>
                      <div className="mt-2 text-sm text-secondary leading-[36px] font-light tracking-[1.5px]">{service.description}</div>
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
              精選課程
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">featured sessions</div>
            </div>
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature) => {
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
                })}
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => openLineAtAccount()}>
                預約諮詢
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
                {comments.map((comment) => {
                  return (
                    <div key={comment.id} className="px-4 py-4 shadow-md rounded-md h-full mr-4">
                      <div className="flex gap-4 items-center">
                        <img
                          className="rounded-full w-[48px] h-[48px] object-cover"
                          src={comment.avatar}
                          alt={comment.name}
                        />
                        <div>
                          <div className="text-xs text-secondary">{comment.name}</div>
                          <div className="flex mt-[2px]">
                            {Array(5).fill(0).map((v, i) => {
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
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-secondary tracking-[1.5px] leading-[24px]">
                        {comment.text}
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
              <img src="/images/chlitina_1.jpg" className="aspect-[16/9] object-cover w-full" />
            </div>
            <div className="mt-8">
              <img src="/images/chlitina_2.jpg" className="object-contain w-full" />
            </div>
          </div>
          <div className="mt-12">
            <div className="text-center text-lg text-secondary font-semibold tracking-[1.5px] bg-primary py-2">
              加入我們
              <div className="mt-2 text-xs tracking-[3px] font-light uppercase">join us</div>
            </div>
            <div className="mt-12 md:hidden w-full h-[1px] bg-[#ccc]"></div>
            <div className="mt-12 md:grid md:grid-cols-3 md:max-w-lg mx-auto">
              <div className="flex justify-center bg-white py-4 rounded-md">
                <div className="md:text-md text-3xl font-semibold tracking-[1.5px] font-['BakudaiMedium']">
                  艾比美容工作室
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex justify-center items-center">
                <XMarkIcon className="text-black w-[32px] h-[32px]" />
              </div>
              <div className="rounded-md px-4 py-4 bg-white mt-4 md:mt-0 flex items-center">
                <img src="/images/logo_chlitina.jpg" alt="Chlitina Logo" />
              </div>
            </div>
            <div className="mt-12 md:mt-8">
              <div className="bg-primary px-8 py-8 shadow-md rounded-md">
                
                {/* <div className="grid grid-cols-2 gap-x-8 mt-8">
                  <div className="flex flex-col gap-4 items-center justify-center rounded-md bg-secondary py-4 px-4">
                    <div>
                      <BookOpenIcon className="text-primary w-[48px] h-[48px]" />
                    </div>
                    <div className="text-primary tracking-[3px] text-sm md:text-md text-center">
                      專業講師系統化教學
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-center justify-center rounded-md bg-secondary py-4 px-4">
                    <Hand className="text-primary w-[48px] h-[48px]" />
                    <div className="text-primary tracking-[3px] text-sm md:text-md text-center">
                      資深美容師一對一輔導手技
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-center justify-center rounded-md bg-secondary py-4 px-4">
                    <div>
                      <BookOpenIcon className="text-primary w-[48px] h-[48px]" />
                    </div>
                    <div className="text-primary tracking-[3px] text-sm md:text-md text-center">
                      圖文並茂的教學教材
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-center justify-center rounded-md bg-secondary py-4 px-4">
                    <div>
                      <BookOpenIcon className="text-primary w-[48px] h-[48px]" />
                    </div>
                    <div className="text-primary tracking-[3px] text-sm md:text-md text-center">
                      專屬的進貨管道
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-center justify-center rounded-md bg-secondary py-4 px-4">
                    <div>
                      <BookOpenIcon className="text-primary w-[48px] h-[48px]" />
                    </div>
                    <div className="text-primary tracking-[3px] text-sm md:text-md text-center">
                      終身複訓資格
                    </div>
                  </div>
                </div> */}
                <div className="mt-0">
                  <div className="font-light text-sm text-secondary leading-[36px] tracking-[1.5px]">
                    我們誠摯邀請對美容充滿興趣與熱忱的零基礎學員，提供專業的教學課程和手技訓練，涵蓋初階與進階班，並提供終身免費複訓的權利。學員無需綁約，亦不需繳納任何形式的訂金。
                    <br /><br />課程由經驗豐富的專業講師以系統化的方式授課，指導肌膚判別、皮膚生理學、產品學、銷售技巧等專業知識，並提供精心編寫、圖文並茂的教材供學員使用。
                    <br /><br />課程中將使用克麗緹娜產品，針對不同膚況提供高規格的產品選擇。
                    <br /><br />此外，資深美容師將在課程中指導美容手技。課程外，學員還可享受加盟店長手把手專業輔導，包含臨摹、實際客人操作和手技矯正等專業指導。
                    <br /><br />課程結束後，公司提供完善的加盟開店制度，提供學員專屬的進貨管道及協助打造加盟品牌。
                    <br /><br />我們的產品均由克麗緹娜提供。克麗緹娜是一個擁有超過三十年歷史的美容品牌，在台灣及國際市場廣受歡迎，連續8次榮獲國際品牌獎，並在全球擁有數千家加盟店。
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
