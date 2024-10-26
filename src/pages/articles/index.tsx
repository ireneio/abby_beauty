import Breadcrumb from "@/components/client/Breadcrumb";
import { Input, InputGroup } from "@/components/common/input";
import { Select } from "@/components/common/select";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import { ArchiveBoxXMarkIcon, ChevronDoubleRightIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const getStaticProps: GetStaticProps = async () => {
    const props = {
        articles: [],
        tags: [],
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

    const getTags = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/article_tags',
        })
        if (res.code === 0) {
            return res.data.rows
        }
        return []
    }

    const [articles, tags] = await Promise.all([
        getArticles(),
        getTags()
    ])

    props.articles = articles
    props.tags = tags

    return {
        props,
        revalidate: 30,
    }
}

type Props = {
    articles: any[],
    tags: any[]
}

export default function Page(props: Props) {
    const { articles: initialArticles, tags } = props
    const router = useRouter()
    const { api } = useApi()
    const { ref, inView } = useInView()
    const [articles, setArticles] = useState<any[]>(initialArticles)
    const [currentPage, setCurrentPage] = useState<number>(2)
    const [total, setTotal] = useState(0)
    const [searching, setSearching] = useState(false)

    const getArticles = async (currentPage: number, search: string) => {
        const res = await api({
            method: 'GET',
            url: '/client/articles',
            params: {
                search: search,
                page: currentPage,
                perPage: 10,
                sortBy: 'publish_date',
                sortDirection: 'desc',
            }
        })
        if (res.code === 0) {
            setArticles((prev) => {
                return [...prev, ...res.data.rows]
            })
            setTotal(res.data.total)
            setCurrentPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        if (inView && (total === 0 || total > articles.length)) {
            getArticles(currentPage, search)
        }
    }, [inView])

    const handleTagChange = (id: string) => {
        router.push(`/articles/${id}`)
    }

    const [search, setSearch] = useState('')

    const debouncedSearch = useCallback(debounce(async (value) => {
        setTotal(0)
        setCurrentPage(1)
        setArticles([])

        setSearching(true)
        await getArticles(1, value)
        setSearching(false)
    }, 800), [])

    const handleSearch = (value: string) => {
        setSearch(value)
        debouncedSearch(value)
    }

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [])

    return (
        <>
            <Head>
                <title>最新消息</title>
                <meta name="description" content={`最新消息 | ${seoDefault.title}`} />
                <meta property="og:title" content="最新消息" />
                <meta property="og:description" content={`最新消息 | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content="最新消息" />
                <meta name="twitter:description" content={`最新消息 | ${seoDefault.title}`} />
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
                                { text: '最新消息' },
                            ]}
                        />
                    </div>
                    <div className="mt-4 lg:flex lg:gap-8 lg:px-4">
                        <div className="lg:hidden px-4 mb-4 lg:min-w-[420px] max-w-[420px]">
                            <Select onChange={(e) => handleTagChange(e.target.value)}>
                                <option>選擇文章分類</option>
                                {tags.map((tag) => {
                                    return (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className="hidden lg:block w-[240px] shrink-0 bg-primary min-h-[70vh]">
                            <div className="bg-primary-darkest text-primary px-4 py-4 text-md">文章分類</div>
                            {tags.map((tag) => {
                                return (
                                    <div
                                        key={tag.id}
                                        className="hover:text-primary-darker cursor-pointer text-sm text-primary-darkest px-4 py-2 border-b border-b-[#ccc]"
                                        onClick={() => router.push(`/articles/${tag.id}`)}
                                    >
                                        {tag.name}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex-1">
                            <div className="mb-4 lg:min-w-[420px] max-w-[420px] lg:ml-4 px-4 lg:px-0">
                                <InputGroup>
                                    <MagnifyingGlassIcon />
                                    <Input
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="搜尋關鍵字..."
                                    />
                                </InputGroup>
                            </div>
                            <div className={clsx("grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4", !searching ? 'grid' : 'hidden')}>
                                {articles.map((article) => {
                                    return (
                                        <div key={article.id} className="px-4 pb-4 border-b border-b-[#ccc] md:border-none">
                                            <div className="flex flex-wrap gap-4">
                                                {article.tags.map((tag: any, i: number, arr: any[]) => {
                                                    return (
                                                        <div key={tag.id} className={clsx("text-sm text-secondary px-4 py-2 bg-primary rounded-md", i !== arr.length - 1 ? "mr-[4px]" : '')}>
                                                            <span>{tag.name}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {article.cover ?
                                                <div className="mt-2">
                                                    <Image
                                                        src={article.cover}
                                                        alt={article.title}
                                                        width={500}
                                                        height={500}
                                                        className="object-contain"
                                                    />
                                                </div> : <></>}
                                            <h2 className="mt-2 text-lg lg:text-xl text-primary-darkest font-semibold">{article.title}</h2>
                                            <h3 className="text-md mt-2 text-black">{article.subtitle}</h3>
                                            <div className="mt-4 flex justify-between">
                                                <div className="text-sm text-secondary font-light tracking-[1.5px]">{dayjs(article.publish_date).format('YYYY/MM/DD')}</div>
                                                <div className="hover:opacity-[0.8] flex gap-[0px] cursor-pointer" onClick={() => router.push(`/articles/${article.tags[0].id}/${article.id}`)}>
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
                            <div ref={ref}></div>
                            <div className={clsx("lg:min-h-[50vh] w-full flex-col gap-4 justify-center items-center", articles.length === 0 && !searching ? 'flex': 'hidden')}>
                                <ArchiveBoxXMarkIcon className="w-[48px] text-primary-darkest" />
                                <div className="text-primary-darkest">查無結果</div>
                            </div>
                            <div className={clsx("lg:min-h-[50vh] w-full flex-col gap-4 justify-center items-center", searching ? 'flex': 'hidden')}>
                                <MagnifyingGlassIcon className="w-[48px] text-primary-darkest" />
                                <div className="text-primary-darkest">搜尋中...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}