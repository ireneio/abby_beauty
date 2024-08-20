import { RootLayout } from "@/components/layout/RootLayout";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [data, setData] = useState<any[]>([])

    const getData = async () => {
        const res = await api({
            method: 'GET',
            url: `/client/pages_private`
        })
        if (res.code === 0) {
            setData(res.data)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="mt-4 mb-4 px-4 space-y-4">
                {data.map((page) => {
                    return (
                        <div
                            key={page.id}
                            onClick={() => router.push(`/page_private/${page.slug}`)}
                            className="underline"
                        >{page.title}</div>
                    )
                })}
            </div>
        </>
    )
}