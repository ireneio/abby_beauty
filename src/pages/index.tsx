import { Button } from "@/components/client/Button";
import CarouselBanner from "@/components/client/home/CarouselBanner";
import CarouselComments from "@/components/client/home/CarouselComments";
import { RootLayout } from "@/components/layout/RootLayout";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [banners] = useState<any[]>([
    {
      id: '1',
      image: '/images/banner_1.jpg',
      image_mobile: '/images/banner_mobile_1.jpg',
    },
    {
      id: '2',
      image: '/images/banner_2.jpg',
      image_mobile: '/images/banner_mobile_2.jpg',
    },
    // {
    //   id: '3',
    //   image: '',
    //   image_mobile: '',
    // }
  ])
  
  const [services] = useState<any[]>([
    {
      id: '1',
      image: '/images/service_1.jpg',
      name: '臉部護理',
      description: '專注於提供高品質的臉部護理服務，採用頂級產品與專業技術，為您的肌膚進行深層清潔與營養補充。無論是要對抗歲月痕跡，還是改善膚質，我們都能幫助您的臉龐恢復青春光彩，展現自然亮麗的膚色。',
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
      name: '彩妝服務',
      description: '我們的妝前保養服務專為準備化妝的您量身打造，幫助您在上妝前達到最佳的膚質狀態。透過細緻的清潔、深層保濕與修護，讓您的肌膚更為平滑、透亮，為後續的彩妝打下完美基礎。無論是日常妝容還是重要場合的妝前準備，我們都能確保您的肌膚在最佳狀態下呈現，讓妝容更加服貼、持久。',
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
    <RootLayout>
      <div className="px-4">
        <div className="md:hidden">
          <div className="">
            <CarouselBanner>
              {banners.map((banner) => {
                return (
                  <div key={banner.id}>
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
                  <div key={banner.id}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {services.map((service) => {
                return (
                  <div key={service.id}>
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
        </div>
      </div>
    </RootLayout>
  );
}
