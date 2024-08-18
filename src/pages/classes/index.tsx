import Breadcrumb from "@/components/client/Breadcrumb"
import { Button } from "@/components/client/Button"
import { RootLayout } from "@/components/layout/RootLayout"
import useApi from "@/lib/hooks/useApi"
import openLineAtAccount from "@/lib/utils/openLineAtAccount"
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
                                    <h2 className="font-semibold text-lg mb-2 text-secondary basis-[33%] flex-shrink-0">{value.class_type_name}</h2>
                                    <ul className="space-y-4 flex-1 list-square">
                                        {value.list.map((vvalue: any) => {
                                            return (
                                                <li key={vvalue.id} className="text-left border-b border-b-[#ccc]">
                                                    <span className="text-secondary">{vvalue.name}</span>
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
    )
}