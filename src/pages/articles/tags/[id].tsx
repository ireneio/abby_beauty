import Breadcrumb from "@/components/client/Breadcrumb";
import { Select } from "@/components/common/select";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import formatTextareaContent from "@/lib/utils/formatTextareaContent";
import { ArrowLeftCircleIcon, ChevronDoubleRightIcon, TagIcon } from "@heroicons/react/16/solid";
import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const getStaticPaths: GetStaticPaths = async () => {
    const getAllPaths = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/article_tags',
        })
        if (res.code === 0) {
            return res.data.rows
        }
        return []
    }    

    const list = await getAllPaths()

    const paths = list.map((tag: { id: number }) => ({
        params: { id: tag.id.toString() },
    }));

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const props = {
        articles: [],
        tag: {
            id: '',
            name: '',
        }
    }

    const tagId = params ? params.id as string : ''

    const getArticles = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/articles',
            params: {
                tagIds: tagId,
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

    const getTag = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/article_tags/${tagId}`,
        })
        if (res.code === 0) {
            return res.data
        }
        return []
    }

    const [articles, tag] = await Promise.all([
        getArticles(),
        getTag()
    ])

    props.articles = articles
    props.tag = tag ? tag : { id: '', name: '' }

    return {
        props
    }
}

type Props = {
    articles: any[],
    tag: {
        id: number,
        name: string,
    }
}

export default function Page(props: Props) {
    const { articles: initialArticles, tag } = props
    const router = useRouter()
    const { api } = useApi()
    const { ref, inView } = useInView()
    const [articles, setArticles] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)

    console.log('tag', tag);
    

    const getArticles = async () => {
        const res = await api({
            method: 'GET',
            url: '/client/articles',
            params: {
                tagIds: router.query.id,
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

    return (
        <>
            <Head>
                <title>{tag.name}</title>
                <meta name="description" content={`${tag.name} | ${seoDefault.title}`} />
                <meta property="og:title" content={tag.name} />
                <meta property="og:description" content={`${tag.name} | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={tag.name} />
                <meta name="twitter:description" content={`${tag.name} | ${seoDefault.title}`} />
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
                                { text: '最新消息', url: '/articles' },
                                { text: tag.name },
                            ]}
                        />
                    </div>
                    <div className="mt-4 px-4 flex items-center gap-[4px] cursor-pointer" onClick={() => router.push(`/articles`)}>
                        <ArrowLeftCircleIcon className="h-[16px] text-primary-darker" />
                        <span className="text-sm text-primary-darker">全部分類</span>
                    </div>
                    <div className="mt-4 lg:px-4">
                        <div className="text-primary bg-primary-darkest px-4 py-4 mb-4">{tag.name}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...initialArticles, ...articles].map((article) => {
                                return (
                                    <div key={article.id} className="px-4 pb-4 border-b border-b-[#ccc] md:border-none" onClick={() => router.push(`/articles/${article.id}`)}>
                                        {article.cover ?
                                            <div>
                                                <Image
                                                    src={article.cover}
                                                    alt={article.title}
                                                    width={500}
                                                    height={500}
                                                    className="object-contain"
                                                />
                                            </div> : <></>}
                                        <div className="text-lg lg:text-xl text-primary-darkest font-semibold">{article.title}</div>
                                        <div className="text-md mt-2 text-black">{article.subtitle}</div>
                                        <div className="mt-4 flex justify-between">
                                            <div className="text-sm text-secondary font-light tracking-[1.5px]">{dayjs(article.publish_date).format('YYYY/MM/DD')}</div>
                                            <div className="hover:opacity-[0.8] flex gap-[0px] cursor-pointer" onClick={() => router.push(`/articles/${article.id}`)}>
                                                <span className="text-primary-darker text-sm font-medium">閱讀更多</span>
                                                <ChevronDoubleRightIcon className="w-[20px] text-primary-darker" />
                                            </div>
                                        </div>
                                        {/* <div className="flex mt-2 text-secondary">
                                            <TagIcon className="w-[14px] mr-1" />
                                            {article.tags.map((tag: any, i: number, arr: any[]) => {
                                                return (
                                                    <div key={tag.id} className="text-sm">
                                                        <span>#{tag.name}</span>
                                                        {i !== arr.length - 1 ? <span className="mr-[4px]"></span> : ''}
                                                    </div>
                                                )
                                            })}
                                        </div> */}
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