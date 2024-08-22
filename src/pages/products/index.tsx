import Breadcrumb from "@/components/client/Breadcrumb"
import { Button } from "@/components/client/Button"
import CarouselProduct from "@/components/client/products/CarouselProduct"
import { RootLayout } from "@/components/layout/RootLayout"
import useApi from "@/lib/hooks/useApi"
import { Metadata } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export async function generateMetadata() {
    return {
        title: '艾比美容工作室',
        description: '產品介紹',
    }
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [products, setProducts] = useState<any[]>([])
    const [productTypes, setProductTypes] = useState<any[]>([])

    const getProducts = async () => {
        const res = await api({
            method: 'GET',
            url: '/client/products'
        })
        if (res.code === 0) {
            setProducts(res.data.map((data: any) => {
                return {
                    ...data,
                    image: data.images.length > 0 ? data.images.find((image: any) => image.order === 0) : { url: '' }
                }
            }))
        } else {
            setProducts([])
        }
    }

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
        Promise.all([
            getProducts(),
            getProductTypes()
        ])
    }, [])

    return (
        <>
            <Head>
                <title>產品介紹</title>
                <meta name="description" content={`產品介紹 | 艾比美容工作室`} />
                <meta property="og:title" content={"產品介紹"} />
                <meta property="og:description" content={`產品介紹 | 艾比美容工作室`} />
                {/* <meta property="og:image" content={data.image_cover} /> */}
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/products`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="艾比美容工作室"/>
                {/* <meta name="twitter:card" content={data.image_cover} /> */}
                <meta name="twitter:title" content={"產品介紹"} />
                <meta name="twitter:description" content={`產品介紹 | 艾比美容工作室`} />
                {/* <meta name="twitter:image" content={data.image_cover} /> */}
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div>
                    <div className="px-4">
                        <Breadcrumb
                            list={[
                                { text: '首頁', url: '/' },
                                { text: '產品介紹' },
                            ]}
                        />
                    </div>
                    <div className="px-4 mt-4">
                        {productTypes.map((productType) => {
                            return (
                                <div key={productType.id} className="md:grid md:grid-cols-6 mb-4">
                                    <div
                                        className="space-y-4 cursor-pointer md:col-span-2"
                                        onClick={() => router.push(`/product/series/${productType.id}`)}
                                    >
                                        <div className="text-sm md:text-md bg-primary text-secondary px-4 py-4">
                                            {productType.name}
                                        </div>
                                        <img
                                            src={productType.image_cover}
                                            alt=""
                                            className="object-contain w-full"
                                        />
                                    </div>
                                    <div className="md:col-span-4 mt-4 md:mt-0">
                                        <CarouselProduct>
                                            {products
                                                .filter((product) => {
                                                    return product.product_type_id === productType.id
                                                })
                                                .map((product) => {
                                                    return (
                                                        <div key={product.id} className="relative pb-4" onClick={() => router.push(`/products/${product.id}`)}>
                                                            <div className="px-4">
                                                                <div className="min-h-[140px] flex items-center justify-center">
                                                                    {product.image.url ?
                                                                        <Image
                                                                            src={product.image.url}
                                                                            alt={product.name_zh}
                                                                            objectFit="contain"
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
                                        </CarouselProduct>
                                    </div>
                                </div>
                            )
                        })}
                        {products
                            .filter((product) => {
                                return !product.product_type_id
                            }).length ?
                            <>
                                <div className="space-y-4 cursor-pointer">
                                    <div className="text-sm md:text-md bg-primary text-secondary px-4 py-4">
                                        其他產品
                                    </div>
                                </div>
                                <div>
                                    <CarouselProduct>
                                        {products
                                            .filter((product) => {
                                                return !product.product_type_id
                                            })
                                            .map((product) => {
                                                return (
                                                    <div key={product.id} className="relative" onClick={() => router.push(`/products/${product.id}`)}>
                                                        <div className="px-4">
                                                            <div className="min-h-[140px] flex items-center justify-center">
                                                                {product.image.url ?
                                                                    <Image
                                                                        src={product.image.url}
                                                                        alt={product.name_zh}
                                                                        objectFit="contain"
                                                                        width={140}
                                                                        height={140}
                                                                    /> :
                                                                    <div className="w-[140px] h-[140px]"></div>}
                                                            </div>
                                                            <div className="text-sm md:text-md pb-4 pt-2">
                                                                <div className="text-secondary">{product.name_zh}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </CarouselProduct>
                                </div>
                            </> : null}
                    </div>
                </div>
            </RootLayout>
        </>
    )
}