import Breadcrumb from "@/components/client/Breadcrumb"
import { Button } from "@/components/client/Button"
import { RootLayout } from "@/components/layout/RootLayout"
import { api } from "@/lib/api/connector"
import seoDefault from "@/lib/data/seoDefault"
import { defaultInstance } from "@/lib/hooks/useApi"
import openLineAtAccount from "@/lib/utils/openLineAtAccount"
import { GetStaticProps } from "next"
import Head from "next/head"
import { useMemo } from "react"

export const getStaticProps: GetStaticProps = async () => {
    const props = {
        classes: []
    }

    const getClasses = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/classes'
        })
        if (res.code === 0) {
            return res.data
        } else {
            return []
        }
    }

    props.classes = await getClasses()

    return {
        props,
        revalidate: 30,
    }
}

type Props = {
    classes: any[]
}

export default function Page(props: Props) {
    const { classes } = props

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

    return (
        <>
            <Head>
                <title>課程介紹</title>
                <meta name="description" content={`課程介紹 | ${seoDefault.title}`} />
                <meta property="og:title" content={"課程介紹"} />
                <meta property="og:description" content={`課程介紹 | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/classes`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta name="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={"課程介紹"} />
                <meta name="twitter:description" content={`課程介紹 | ${seoDefault.title}`} />
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
                                { text: '課程介紹' },
                            ]}
                        />
                    </div>
                    <div className="mt-4 px-4">
                        <div className="max-w-sm mx-auto bg-primary p-4">
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
                </div>
            </RootLayout>
        </>
    )
}