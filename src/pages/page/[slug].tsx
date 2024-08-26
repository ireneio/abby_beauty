import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    if (params) {
        const { slug } = params
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/pages/${slug}`,
        })
        if (res.code === 0) {
            return { props: { serverData: res.data } }
        }
        return { props: { serverData: null }}
    }
    return { props: { serverData: null }}
};

export default function Page({ serverData }: any) {
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
            <Head>
                <title>{serverData.title}</title>
                <meta name="description" content={`${serverData.title} | 艾比美容工作室`} />
                <meta property="og:title" content={serverData.title} />
                <meta property="og:description" content={`${serverData.title} | 艾比美容工作室`} />
                {/* <meta property="og:image" content={serverData.image_cover} /> */}
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/page/${router.query.slug}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="艾比美容工作室"/>
                {/* <meta name="twitter:card" content={serverData.image_cover} /> */}
                <meta property="twitter:card" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                <meta name="twitter:title" content={serverData.title} />
                <meta name="twitter:description" content={`${serverData.title} | 艾比美容工作室`} />
                <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} />
                {/* <meta name="twitter:image" content={serverData.image_cover} /> */}
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="px-4">{data.title}</div>
                <div className="mt-4 px-4">
                    <QuillContentWrapper content={data.content} />
                </div>
            </RootLayout>
        </>
    )
}