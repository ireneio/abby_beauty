import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import { defaultInstance } from "@/lib/hooks/useApi";
import { GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const res = await api(defaultInstance, {
        method: 'GET',
        url: `/client/trials`,
    })
    if (res.code === 0) {
        return { props: { serverData: res.data } }
    }
    return { props: { serverData: null }}
};

type Props = any

export default function Page({ serverData }: Props) {

    console.log(serverData);
    

    return (
        <>
            <Head>
                <title>{`預約體驗課程 | ${seoDefault.title}`}</title>
                <meta name="description" content={seoDefault.description} />
                <meta property="og:title" content={seoDefault.title} />
                <meta property="og:description" content={seoDefault.description} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={seoDefault.title} />
                <meta name="twitter:description" content={seoDefault.description} />
                <meta property="twitter:image" content={seoDefault.image} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div></div>
            </RootLayout>
        </>
    )
}