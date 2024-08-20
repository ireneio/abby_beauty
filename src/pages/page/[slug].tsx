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
            url: `/client/pages/${slug}`
        })
        if (res.code === 0) {
            setData(res.data)
        }
    }

    useEffect(() => {
        if (router.query.slug) {
            getData(router.query.slug as string)
        }
    }, [router.query.slug])

    return (
        <>
            <RootLayout>
                <div>{data.title}</div>
                <div className="mt-4">
                    <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
                </div>
            </RootLayout>
        </>
    )
}