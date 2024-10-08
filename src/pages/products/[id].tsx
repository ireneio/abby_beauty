import Breadcrumb from "@/components/client/Breadcrumb";
import { Button } from "@/components/client/Button";
import CarouselProductImage from "@/components/client/product/CarouselProductImage";
import CarouselSimilarProducts from "@/components/client/product/CarouselSimilarProducts";
import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const props = {
        data: {
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
        }
    }
    if (params) {
        const { id } = params
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/products/${id}`,
        })        
        if (res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {
            props.data = res.data[0]
        }
    }
    return {
        props
    }
};

type Props = {
    data: any
}

export default function Page(props: Props) {
    const { data } = props    
    const { api } = useApi()
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState(0)

    const handleLearnMore = () => {
        openLineAtAccount()
    }

    const [similarProducts, setSimilarProducts] = useState<any[]>([])

    const getSimilarProducts = async (product_type_id: number) => {
        const res = await api({
            method: 'GET',
            url: '/client/products',
            params: {
                product_type_id,
            }
        })
        if (res.code === 0) {
            setSimilarProducts(res.data.filter((product: any) => {
                return product.id !== Number(router.query.id)
            }).map((data: any) => {
                return {
                    ...data,
                    image: data.images.length > 0 ? data.images.find((image: any) => image.order === 0) : { url: '' }
                }
            }))
        } else {
            setSimilarProducts([])
        }
    }

    useEffect(() => {
        if (data.product_type_id) {
            getSimilarProducts(data.product_type_id)
        }
    }, [data.product_type_id])

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
        <>
            <Head>
                <title>{data.name_zh}</title>
                <meta name="description" content={`${data.product_type_name} | ${seoDefault.title}`} />
                <meta property="og:title" content={data.name_zh} />
                <meta property="og:description" content={`${data.product_type_name} | ${seoDefault.title}`} />
                {data.images.map((image: any, i: number) => {
                    return(
                        <meta key={i} property="og:image" content={image.url} />
                    )
                })}
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/products/${router.query.id}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta name="twitter:card" content={data.images && data.images.length ? data.images[0].url : ''} />
                <meta name="twitter:title" content={data.name_zh} />
                <meta name="twitter:description" content={`${data.product_type_name} | ${seoDefault.title}`} />
                <meta name="twitter:image" content={data.images && data.images.length ? data.images[0].url : ''} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="px-4">
                        <Breadcrumb
                            list={breadcrumbList}
                        />
                    </div>
                    <div className="px-4 mt-4">
                        <div className="md:grid md:grid-cols-4 md:gap-x-8">
                            <div className="md:col-span-2">
                                <CarouselProductImage>
                                    {data.images.length ?
                                        data.images.map((image: any, index: number) => {
                                            return (
                                                <div key={image.id}>
                                                    <Image
                                                        src={image.url}
                                                        alt={data.name_zh}
                                                        width={500}
                                                        height={500}
                                                        className="object-contain aspect-[1/1] w-full h-auto"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            )
                                        }) :
                                        <div></div>
                                    }
                                </CarouselProductImage>
                            </div>
                            <div className="mt-4 md:mt-0 md:col-span-2">
                                <div className="text-xl font-semibold">{data.name_zh}</div>
                                <div className="mt-4">
                                    <QuillContentWrapper content={data.features} />
                                </div>
                                <div className="text-sm text-secondary bg-primary px-4 py-4 mt-4">
                                    產品規格
                                </div>
                                <div className="mt-4 px-4">
                                    <QuillContentWrapper content={data.size} />
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
                                    <QuillContentWrapper content={data.ingredients} />
                                </div>
                                <div className="mt-8 text-sm text-secondary bg-primary px-4 py-4">
                                    使用方式
                                </div>
                                <div className="mt-8 px-4">
                                    <QuillContentWrapper content={data.usage} />
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
                                {currentTab === 0 ?
                                    <QuillContentWrapper content={data.ingredients} />
                                    : null}
                                {currentTab === 1 ?
                                    <QuillContentWrapper content={data.usage} />
                                : null}
                            </div>
                        </div>
                        <div className="mt-8 w-full bg-[#ccc] h-[1px]"></div>
                        <div className="mt-8">
                            <div className="text-sm text-secondary bg-primary px-4 py-4">
                                同系列產品
                            </div>
                            <div className="mt-4">
                                <CarouselSimilarProducts>
                                    {similarProducts
                                        .map((product) => {
                                            return (
                                                <div
                                                    key={product.id}
                                                    className="relative pb-4"
                                                    onClick={() => router.push(`/products/${product.id}`)}
                                                >
                                                    <div className="px-4">
                                                        <div className="min-h-[140px] w-full flex items-center justify-center">
                                                            {product.image.url ?
                                                                <Image
                                                                    src={product.image.url}
                                                                    alt={product.name_zh}
                                                                    className="object-contain w-[140px] h-[140px] aspect-[1/1]"
                                                                    width={140}
                                                                    height={140}
                                                                /> :
                                                                <div className="w-[140px] h-[140px]"></div>}
                                                        </div>
                                                        <div className="text-sm md:text-md pt-2">
                                                            <div className="text-secondary">{product.name_zh}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </CarouselSimilarProducts>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}
