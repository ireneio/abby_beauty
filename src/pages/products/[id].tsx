import Breadcrumb from "@/components/client/Breadcrumb";
import { Button } from "@/components/client/Button";
import CarouselProductImage from "@/components/client/product/CarouselProductImage";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import clsx from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {

    console.log('params.id', params.id);

    
    // read route params
    const id = params.id

    console.log('id', id);
    
    // fetch data
    const product = await api(defaultInstance, {
        method: 'GET',
        url: `/client/products/${id}`
    }).then((res) => {
        if (res.code && res.data.length) {
            return {
                ...res.data[0],
                images: res.data[0].images.map((image: any) => image.url)
            }
        }
        return {
            title: '',
            images: [],
        }
    })
   
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
   
    return {
      title: product.title,
      openGraph: {
        images: [...product.images, ...previousImages],
      },
    }
  }

export default function Page() {
    const { api } = useApi() 
    const router = useRouter()
    const [data, setData] = useState({
        name_zh: '',
        name_en: '',
        features: '',
        size: '',
        sku: '',
        target_users: '',
        usage: '',
        ingredients: '',
        images: [],
        product_type_name: '',
        product_type_id: null,
    })
    const [currentTab, setCurrentTab] = useState(0)

    const handleLearnMore = () => {
        openLineAtAccount()
    }

    const getData = async (id: string) => {
        const res = await api({
            method: 'GET',
            url: `/client/products/${id}`
        })
        if (res.code === 0 && res.data && res.data.length > 0) {
            setData(res.data[0])
        }
    }

    useEffect(() => {
        if (router.query.id) {
            getData(router.query.id as string)
        }
    }, [router.query.id])

    const breadcrumbList = useMemo(() => {
        if (data.product_type_id) {
            return [
                { text: '首頁', url: '/' },
                { text: '產品介紹', url: '/products' },
                { text: data.product_type_name, url: `/product/series/${data.product_type_id}` },
                { text: data.name_zh }
            ]
        }
        return [
            { text: '首頁', url: '/' },
            { text: '產品介紹', url: '/products' },
            { text: data.name_zh }
        ]
    }, [data])

    return (
       <RootLayout>
            <div className="px-4">
                <Breadcrumb
                    list={breadcrumbList}
                />
            </div>
            <div className="px-4 mt-4">
                <div className="md:grid-cols-4 md:gap-x-8">
                    <div className="md:col-span-1">
                        <CarouselProductImage>
                            {data.images.length ?
                                data.images.map((image: any) => {
                                    return (
                                        <div key={image.id}>
                                            <img
                                                src={image.url}
                                                alt=""
                                                className="object-contain aspect-[1/1]"
                                            />
                                        </div>
                                    )
                                }) :
                                <div></div>
                            }
                        </CarouselProductImage>
                    </div>
                    <div className="mt-4 md:mt-0 md:col-span-3">
                        <div className="text-xl font-semibold">{data.name_zh}</div>
                        <div className="mt-4">
                            <div
                                dangerouslySetInnerHTML={{ __html: data.features }}
                            ></div>
                        </div>
                        <div className="text-sm text-secondary bg-primary px-4 py-4 mt-4">
                            產品規格
                        </div>
                        <div className="mt-4 px-4">
                            <div
                                className="mt-4"
                                dangerouslySetInnerHTML={{ __html: data.size }}
                            ></div>
                        </div>
                        <div className="mt-8">
                            <Button onClick={() => handleLearnMore()}>
                                瞭解更多
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="md:hidden">
                    <div className="mt-8">
                        <div className="text-sm text-secondary bg-primary px-4 py-4">
                            主成份
                        </div>
                        <div className="mt-8 px-4">
                            <div dangerouslySetInnerHTML={{ __html: data.ingredients }}></div>
                        </div>
                        <div className="mt-8 text-sm text-secondary bg-primary px-4 py-4">
                            使用方式
                        </div>
                        <div className="mt-8 px-4">
                            <div dangerouslySetInnerHTML={{ __html: data.usage }}></div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="mt-8 flex gap-4 border-b border-b-[#ccc] pb-2 px-4">
                        <div
                            onClick={() => setCurrentTab(0)}
                            className={clsx("text-md text-secondary cursor-pointer", currentTab === 0 ? 'font-semibold' : '')}
                        >
                            主成份
                        </div>
                        <div
                            onClick={() => setCurrentTab(1)}
                            className={clsx("text-md text-secondary cursor-pointer", currentTab === 1 ? 'font-semibold' : '')}
                        >
                            使用方式
                        </div>
                    </div>
                    <div className="mt-4 px-4">
                        {currentTab === 0 ? <div>
                            <div dangerouslySetInnerHTML={{ __html: data.ingredients }}></div>
                        </div> : null}
                        {currentTab === 1 ? <div>
                            <div dangerouslySetInnerHTML={{ __html: data.usage }}></div>
                        </div> : null}
                    </div>
                </div>
            </div>
       </RootLayout>
    )
}