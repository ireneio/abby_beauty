import Breadcrumb from "@/components/client/Breadcrumb"
import CarouselProduct from "@/components/client/products/CarouselProduct"
import { RootLayout } from "@/components/layout/RootLayout"
import { api } from "@/lib/api/connector"
import seoDefault from "@/lib/data/seoDefault"
import { defaultInstance } from "@/lib/hooks/useApi"
import { GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"

export const getStaticProps: GetStaticProps = async () => {  
    const getProducts = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/products',
        })
        if (res.code === 0) {
            return res.data.map((data: any) => {
                return {
                    ...data,
                    image: data.images.length > 0 ? data.images.find((image: any) => image.order === 0) : { url: '' }
                }
            })
        } else {
            return []
        }
    }

    const getProductTypes = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/product_types/`,
        })
        if (res.code === 0) {
            return res.data
        } else {
            return []
        }
    }

    const [products, productTypes] = await Promise.all([
        getProducts(),
        getProductTypes()
    ])

    const props = {
        products,
        productTypes,
    }
  
    return {
      props,
      revalidate: 10,
    };
};

type Props = {
    products: any[],
    productTypes: any[]
}

export default function Page(props: Props) {
    const { products, productTypes } = props
    const router = useRouter()

    return (
        <>
            <Head>
                <title>產品介紹</title>
                <meta name="description" content={`產品介紹 | ${seoDefault.title}`} />
                <meta property="og:title" content={"產品介紹"} />
                <meta property="og:description" content={`產品介紹 | ${seoDefault.title}`} />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/products`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                <meta name="twitter:title" content={"產品介紹"} />
                <meta name="twitter:description" content={`產品介紹 | ${seoDefault.title}`} />
                <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="px-4">
                        <Breadcrumb
                            list={[
                                { text: '首頁', url: '/' },
                                { text: '產品介紹' },
                            ]}
                        />
                    </div>
                    <div className="px-4 mt-4">
                        {productTypes.map((productType, index) => {
                            return (
                                <div key={productType.id} className="md:grid md:grid-cols-6 mb-4">
                                    <div
                                        className="space-y-4 cursor-pointer md:col-span-2"
                                        onClick={() => router.push(`/product/series/${productType.id}`)}
                                    >
                                        <div className="text-sm md:text-md bg-primary text-secondary px-4 py-4">
                                            {productType.name}
                                        </div>
                                        <Image
                                            src={productType.image_cover}
                                            alt={productType.name}
                                            width={900}
                                            height={1200}
                                            className="object-contain w-full h-auto"
                                            priority={index === 0 || index === 1}
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
                                                                <div className="min-h-[140px] w-[140px] flex items-center justify-center">
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