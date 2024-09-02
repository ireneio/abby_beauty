import Breadcrumb from "@/components/client/Breadcrumb";
import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import { defaultInstance } from "@/lib/hooks/useApi";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export const getStaticPaths: GetStaticPaths = async () => {
    const getAllPaths = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/product_types',
        })
        if (res.code === 0) {
            return res.data
        }
        return []
    }

    const list = await getAllPaths()

    const paths = list.map((productType: { id: number }) => ({
        params: { id: productType.id.toString() },
    }));

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!; // 'id' is the dynamic parameter
  
    const getProducts = async (product_type_id: string) => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/products',
            params: {
                product_type_id,
            }
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

    const getData = async (id: string) => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/product_types/${id}`,
        })
        if (res.code === 0 && res.data && res.data.length > 0) {
            return res.data[0]
        } else {
            return {
                name: '',
                image_cover: '',
                description: '',
            }
        }
    }

    const [products, data] = await Promise.all([
        getProducts(id as string),
        getData(id as string)
    ])

    const props = {
        data,
        products,
    }
  
    return {
      props,
      revalidate: 30,
    };
};

type Props = {
    data: any,
    products: any[]
}

export default function Page({ data, products }: Props) {
    const router = useRouter()
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    })

    const [currentDataKey, setCurrentDataKey] = useState(10)

    const productsMemo: any[] = useMemo(() => {
        return products.slice(0, currentDataKey)
    }, [products, currentDataKey])

    useEffect(() => {
        if (inView && currentDataKey < products.length) {
            setCurrentDataKey(currentDataKey + 10)
        }
    }, [inView])

    return (
        <>
            <Head>
                <title>{data.name}</title>
                <meta name="description" content={`${data.name} | ${seoDefault.title}`} />
                <meta property="og:title" content={data.name} />
                <meta property="og:description" content={`${data.name} | ${seoDefault.title}`} />
                <meta property="og:image" content={data.image_cover} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/product/series/${router.query.id}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={`${seoDefault.title}`} />
                <meta name="twitter:card" content={data.image_cover} />
                <meta name="twitter:title" content={data.name} />
                <meta name="twitter:description" content={`${data.name} | ${seoDefault.title}`} />
                <meta name="twitter:image" content={data.image_cover} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="px-4">
                    <Breadcrumb
                        list={[
                            { text: '首頁', url: '/' },
                            { text: '產品介紹', url: '/products' },
                            { text: data.name },
                        ]}
                    />
                </div>
                <div className="px-4 mt-4">
                    <QuillContentWrapper content={data.description} />
                    <div className="md:hidden mt-4 px-4 w-full h-[1px] bg-[#ccc]"></div>
                    <div className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            {productsMemo.map((product) => {
                                return (
                                    <div key={product.id} className="cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
                                        <div>
                                            <div className="min-h-[140px] w-full flex items-center justify-center">
                                                {product.image.url ?
                                                    <Image
                                                        src={product.image.url}
                                                        alt={product.name_zh}
                                                        className="object-contain aspect-[1/1] h-[140px] w-[140px]"
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
                        </div>
                        <div ref={ref}></div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}
