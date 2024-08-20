import { RootLayout } from "@/components/layout/RootLayout";
import useApi from "@/lib/hooks/useApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [data, setData] = useState<any>({
        title: '',
        content: '',
    })

    const getData = async (slug: string) => {
        const res = await api({
            method: 'GET',
            url: `/client/pages_private/${slug}`
        })
        if (res.code === 0) {
            setData({
                ...res.data,
                content: res.data.content
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
            })
        }
    }

    useEffect(() => {
        if (router.query.slug) {
            getData(router.query.slug as string)
        }
    }, [router.query.slug])

    return (
        <>
            <div className="px-4">{data.title}</div>
            <div className="mt-4 px-4">
                <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
        </>
    )
}