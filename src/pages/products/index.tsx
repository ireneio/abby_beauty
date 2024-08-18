import { Button } from "@/components/client/Button"
import { RootLayout } from "@/components/layout/RootLayout"
import useApi from "@/lib/hooks/useApi"
import { Metadata } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export async function generateMetadata() {
    return {
        title: '產品介紹',
        description: '所有產品介紹',
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
        <RootLayout>
            <div>
                <div>產品介紹</div>
                <div className="grid grid-cols-2 md:grid-cols-4">
                    {products.map((product) => {
                        return (
                            <div key={product.id} className="relative odd:border-r odd:border-r-[#ccc] border-b border-b-[#ccc] md:border-r-transparent">
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
                                        <div>{product.product_type_name}{product.name_zh}</div>
                                        <div
                                            className="mt-2 text-gray-800 pb-4 h-[120px] overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: product.features }}
                                        ></div>
                                        <div className="w-[1px] h-[32px]"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <Button onClick={() => router.push(`/products/${product.id}`)}>
                                                瞭解更多
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </RootLayout>
    )
}