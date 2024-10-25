import Breadcrumb from "@/components/client/Breadcrumb"
import { Button } from "@/components/client/Button"
import { RootLayout } from "@/components/layout/RootLayout"
import { api } from "@/lib/api/connector"
import seoDefault from "@/lib/data/seoDefault"
import { defaultInstance } from "@/lib/hooks/useApi"
import formatTextareaContent from "@/lib/utils/formatTextareaContent"
import openLineAtAccount from "@/lib/utils/openLineAtAccount"
import { GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"

export const getStaticProps: GetStaticProps = async () => {
    const props = {
        data: {
            image: '',
            content: '',
        }
    }

    const getData = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/joinus'
        })
        if (res.code === 0) {
            return res.data
        } else {
            return {
                image: '',
                content: '',
            }
        }
    }

    props.data = await getData()

    return {
        props,
        revalidate: 30,
    }
}

type Props = {
    data: any
}

export default function Page(props: Props) {
    const { data } = props

    return (
        <>
            <Head>
                <title>加入我們</title>
                <meta name="description" content={`加入我們 | ${seoDefault.title}`} />
                <meta property="og:title" content={"加入我們"} />
                <meta property="og:description" content={`加入我們 | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/joinus`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta name="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={"加入我們"} />
                <meta name="twitter:description" content={`加入我們 | ${seoDefault.title}`} />
                <meta name="twitter:image" content={seoDefault.image} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="px-4">
                        <Breadcrumb
                            list={[
                                { text: '首頁', url: '/' },
                                { text: '加入我們' },
                            ]}
                        />
                    </div>
                    <div className="mt-4 px-4">
                        <div className="hidden lg:block pt-8 pb-8 bg-primary/30">
                            <div className="text-center text-2xl text-primary-darker font-semibold tracking-[1.5px]">
                                加入我們
                                <div className="cormorant-normal mt-2 text-xl tracking-[3px] font-light uppercase">join us</div>
                            </div>
                            <div className="lg:flex lg:gap-12 px-4 max-w-7xl mx-auto">
                                <div className="mt-12">
                                <div className="flex justify-center shadow-md rounded-md">
                                    <div className="h-[150px] md:h-[300px] bg-[#fff]">
                                        <Image
                                            src={data.image}
                                            alt="加入我們"
                                            width={1920}
                                            height={1080}
                                            className="aspect-[16/9] object-contain px-4 md:px-0 h-[150px] md:h-[300px]"
                                        />
                                    </div>
                                </div>
                                </div>
                                <div className="mt-12">
                                <div className="bg-primary px-8 py-8 shadow-md rounded-md">
                                    <div className="mt-0">
                                    <div
                                        className="font-light text-sm text-secondary leading-[36px] tracking-[1.5px]"
                                        dangerouslySetInnerHTML={{ __html: formatTextareaContent(data.content) }}
                                    >
                                    </div>
                                    </div>
                                    <div className="mt-8 flex justify-center">
                                    <Button onClick={() => openLineAtAccount()}>暸解更多</Button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden bg-primary/30">
                            <div className="relative pt-8 pb-8 text-center text-2xl text-primary-darkest font-semibold tracking-[1.5px]">
                                <Image
                                    src={"/images/join_us_bg.jpg"}
                                    alt="加入我們"
                                    width={1920}
                                    height={1080}
                                    className="absolute top-0 left-0 right-0 bottom-0 object-cover max-h-[100%] opacity-[0.33]"
                                />
                                    加入我們
                                <div className="cormorant-normal mt-2 text-xl tracking-[3px] font-light uppercase">join us</div>
                            </div>
                            <div className="lg:flex lg:gap-12">
                                <div className="mt-8">
                                <div className="px-8 pb-8">
                                    <div className="flex justify-center shadow-md rounded-md">
                                    <div className="h-[150px] md:h-[300px]">
                                        <Image
                                            src={data.image}
                                            alt="加入我們"
                                            width={1920}
                                            height={1080}
                                            className="aspect-[16/9] object-contain px-4 md:px-0 h-[150px] md:h-[300px]"
                                        />
                                    </div>
                                    </div>
                                    <div className="mt-8">
                                    <div
                                        className="font-normal text-sm text-secondary leading-[36px] tracking-[1.5px]"
                                        dangerouslySetInnerHTML={{ __html: formatTextareaContent(data.content) }}
                                    >
                                    </div>
                                    </div>
                                    <div className="mt-8 flex justify-center">
                                        <Button onClick={() => openLineAtAccount()}>暸解更多</Button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}