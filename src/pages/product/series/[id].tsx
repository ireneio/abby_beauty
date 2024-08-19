import Breadcrumb from "@/components/client/Breadcrumb";
import { RootLayout } from "@/components/layout/RootLayout";
import useApi from "@/lib/hooks/useApi";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
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
                {/* <img
                    src={data.image_cover}
                    alt=""
                    className="object-contain"
                /> */}
                {/* <div className="text-lg mt-4 font-semibold">
                    {data.name}
                </div> */}
                <div className="ql-editor">
                    <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
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
    )
}
