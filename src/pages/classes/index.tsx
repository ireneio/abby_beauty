import Breadcrumb from "@/components/client/Breadcrumb"
import { Button } from "@/components/client/Button"
import { RootLayout } from "@/components/layout/RootLayout"
import useApi from "@/lib/hooks/useApi"
import openLineAtAccount from "@/lib/utils/openLineAtAccount"
import Head from "next/head"
import { useEffect, useMemo, useState } from "react"

export async function generateMetadata() {
    return {
        title: '艾比美容工作室',
        description: '產品介紹',
    }
}

export default function Page() {
    const { api } = useApi()
    const [classes, setClasses] = useState<any[]>([])

    const classesMemo = useMemo(() => {
        return classes.reduce((a, c) => {
            const existingTypeIndex = a.findIndex((v: any) => v.class_type_id === c.class_type_id)
            if (existingTypeIndex <= -1) {
                a = [
                    ...a,
                    {
                        class_type_id: c.class_type_id,
                        class_type_name: c.class_type_name,
                        list: [c]
                    }
                ]
            } else {
                a = a.map((v: any, i: number) => {
                    if (i === existingTypeIndex) {
                        return {
                            ...a[existingTypeIndex],
                            list: [...a[existingTypeIndex].list, c]
                        }
                    }
                    return v
                })
            }
            return a
        }, [])
    }, [classes])

    const getClasses = async () => {
        const res = await api({
            method: 'GET',
            url: '/client/classes'
        })
        if (res.code === 0) {
            setClasses(res.data)
        } else {
            setClasses([])
        }
    }

    useEffect(() => {
        getClasses()
    }, [])

    return (
        <>
            <Head>
                <title>課程介紹</title>
                <meta name="description" content={`課程介紹 | 艾比美容工作室`} />
                <meta property="og:title" content={"課程介紹"} />
                <meta property="og:description" content={`課程介紹 | 艾比美容工作室`} />
                {/* <meta property="og:image" content={data.image_cover} /> */}
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/classes`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="艾比美容工作室"/>
                {/* <meta name="twitter:card" content={data.image_cover} /> */}
                <meta name="twitter:title" content={"課程介紹"} />
                <meta name="twitter:description" content={`課程介紹 | 艾比美容工作室`} />
                {/* <meta name="twitter:image" content={data.image_cover} /> */}
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="px-4">
                    <Breadcrumb
                        list={[
                            { text: '首頁', url: '/' },
                            { text: '課程介紹' },
                        ]}
                    />
                </div>
                <div className="mt-4 px-4">
                    <div className="max-w-sm mx-auto bg-primary p-4">
                        {/* <div className="bg-pink-300 p-4 text-center text-lg font-bold">
                            艾比美容工作室課程介紹
                        </div> */}
                        <div className="space-y-4">
                            {classesMemo.map((value: any) => {
                                return (
                                    <div key={value.class_type_id} className="flex w-full gap-4">
                                        <h2 className="pt-[4px] md:pt-0 font-semibold text-sm md:text-lg mb-2 text-secondary basis-[33%] flex-shrink-0">{value.class_type_name}</h2>
                                        <ul className="space-y-2 md:space-y-4 flex-1 list-square">
                                            {value.list.map((vvalue: any) => {
                                                return (
                                                    <li key={vvalue.id} className="text-left border-b border-b-[#ccc] pb-1 md:pb-2">
                                                        <span className="text-sm md:text-md text-secondary">{vvalue.name}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="mt-4 px-4 flex justify-center">
                    <Button onClick={() => openLineAtAccount()}>
                        預約諮詢
                    </Button>
                </div>
            </RootLayout>
        </>
    )
}