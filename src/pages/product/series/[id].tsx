import Breadcrumb from "@/components/client/Breadcrumb";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    if (params) {
        const { id } = params
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/product_types/${id}`,
        })
        if (res.code === 0 && Array.isArray(res.data) && res.data.length > 0) {
            return { props: { serverData: res.data[0] } }
        }
        return { props: { serverData: null }}
    }
    return { props: { serverData: null }}
};

export default function Page({ serverData }: any) {
    const router = useRouter()
    const { api } = useApi()
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
      })
    const [data, setData] = useState<any>({
        name: '',
        description: '',
        image_cover: '',
    })
    const [products, setProducts] = useState<any[]>([])

    const getProducts = async (product_type_id: string) => {
        const res = await api({
            method: 'GET',
            url: '/client/products',
            params: {
                product_type_id,
            }
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

    const getData = async (id: string) => {
        const res = await api({
            method: 'GET',
            url: `/client/product_types/${id}`,
        })
        if (res.code === 0 && res.data && res.data.length > 0) {
            setData(res.data[0])
        } else {
            setData({
                name: '',
                image_cover: '',
            })
        }
    }

    useEffect(() => {
        if (router.query.id) {
            Promise.all([
                getData(router.query.id as string),
                getProducts(router.query.id as string)
            ])
        }
    }, [router.query.id])

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
                <title>{serverData.name}</title>
                <meta name="description" content={`${serverData.name} | 艾比美容工作室`} />
                <meta property="og:title" content={serverData.name} />
                <meta property="og:description" content={`${serverData.name} | 艾比美容工作室`} />
                <meta property="og:image" content={serverData.image_cover} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/product/series/${router.query.id}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="艾比美容工作室"/>
                <meta name="twitter:card" content={serverData.image_cover} />
                <meta name="twitter:title" content={serverData.name} />
                <meta name="twitter:description" content={`${serverData.name} | 艾比美容工作室`} />
                <meta name="twitter:image" content={serverData.image_cover} />
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
                    <div className="ql-snow">
                        <div className="ql-editor">
                            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                        </div>
                    </div>
                    <div className="md:hidden mt-4 px-4 w-full h-[1px] bg-[#ccc]"></div>
                    <div className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            {productsMemo.map((product) => {
                                return (
                                    <div key={product.id} className="cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
                                        <div>
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
                        </div>
                        <div ref={ref}></div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}
