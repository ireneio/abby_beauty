import Breadcrumb from "@/components/client/Breadcrumb";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import { TagIcon } from "@heroicons/react/16/solid";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const getStaticProps: GetStaticProps = async () => {
    const props = {
        articles: []
    }

    const getArticles = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/articles',
            params: {
                page: 1,
                perPage: 10,
                sortBy: 'publish_date',
                sortDirection: 'desc',
            }
        })
        if (res.code === 0) {
            return res.data.rows
        }
        return []
    }

    props.articles = await getArticles()

    return {
        props
    }
}

type Props = {
    articles: any[]
}

export default function Page(props: Props) {
    const { articles: initialArticles } = props
    const { api } = useApi()
    const { ref, inView } = useInView()
    const [articles, setArticles] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

    const getArticles = async () => {
        const res = await api({
            method: 'GET',
            url: '/client/articles',
            params: {
                page: currentPage,
                perPage: 10,
                sortBy: 'publish_date',
                sortDirection: 'desc',
            }
        })
        if (res.code === 0) {
            setArticles((prev) => {
                return [...prev, articles]
            })
            setCurrentPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        if (inView) {
            getArticles()
        }
    }, [inView])

    console.log('initialArticles', initialArticles);

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
                <div className="max-w-7xl mx-auto">
                    <div className="px-4">
                        <Breadcrumb
                            list={[
                                { text: '首頁', url: '/' },
                                { text: '文章列表' },
                            ]}
                        />
                    </div>
                    <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {[...initialArticles, ...articles].map((article) => {
                                return (
                                    <div key={article.id} className="px-4">
                                        <div className="text-md truncate">{article.title}</div>
                                        <div className="text-sm">{article.subtitle}</div>
                                        <div className="flex">
                                            <TagIcon className="w-[16px]" />
                                            {article.tags.map((tag: any, i: number, arr: any[]) => {
                                                return (
                                                    <div key={tag.id} className="text-sm">
                                                        <span>{tag.name}</span>
                                                        {i !== arr.length - 1 ? <span className="mr-[2px]">,</span> : ''}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}