import { RootLayout } from "@/components/layout/RootLayout";
import useApi from "@/lib/hooks/useApi";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
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
            <div className="mt-4 px-4 flex items-center gap-4">
                <div onClick={() => router.push('/page_private')}>
                    <ArrowLeftIcon className="w-[24px] h-[24px]" />
                </div>
                <span>{data.title}</span>
            </div>
            <div className="mt-4 mb-4 px-4">
                <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
        </>
    )
}