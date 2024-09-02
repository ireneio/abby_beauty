import Breadcrumb from "@/components/client/Breadcrumb";
import { RootLayout } from "@/components/layout/RootLayout";
import seoDefault from "@/lib/data/seoDefault";
import Head from "next/head";

export default function Page() {
    return (
        <>
            <Head>
                <title>文章列表</title>
                <meta name="description" content={`文章列表 | ${seoDefault.title}`} />
                <meta property="og:title" content="文章列表" />
                <meta property="og:description" content={`文章列表 | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content="文章列表" />
                <meta name="twitter:description" content={`文章列表 | ${seoDefault.title}`} />
                <meta property="twitter:image" content={seoDefault.image} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="px-4">
                    <Breadcrumb
                        list={[
                            { text: '首頁', url: '/' },
                            { text: '文章列表' },
                        ]}
                    />
                </div>
                <div className="mt-4 px-4"></div>
            </RootLayout>
        </>
    )
}