import Breadcrumb from "@/components/client/Breadcrumb";
import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import { Select } from "@/components/common/select";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import formatTextareaContent from "@/lib/utils/formatTextareaContent";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowTopRightOnSquareIcon, ShareIcon, TagIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const props = {
        article: {
            id: '',
            title: '',
            subtitle: '',
            content: '',
            tags: [],
        }
    }

    const id = params ? params.article_id as string : ''

    const getArticle = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/articles/${id}`,
        })
        if (res.code === 0) {
            return res.data
        }
        return { notFound: true }
    }

    props.article = await getArticle()

    return {
        props,
        revalidate: 30,
    }
}

type Props = {
    article: any,
}

export default function Page(props: Props) {
    const { article } = props
    const router = useRouter()
    const { api } = useApi()

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
              title: article.title,
              text: article.title,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.tag_id}/${article.id}`,
            })
              .then(() => console.log('Successfully shared'))
              .catch((error) => console.error('Error sharing:', error));
          } else {
            console.log('Web Share API is not supported in this browser.');
          }
    }

    const [content, setContent] = useState({
        similarItems: [],
        nextItem: {
            id: '',
            title: '',
        },
        previousItem: {
            id: '',
            title: '',
        },
    })

    const getContent = async () => {
        const res = await api({
            method: 'GET',
            url: `/client/articles/${article.id}/content`,
            params: {
                tagIds: article.tags.map((tag: any) => tag.id).join(',')
            }
        })
        if (res.code === 0) {
            setContent(res.data)
        }
    }

    useEffect(() => {
        setContent((prev) => {
            return {
                ...prev,
                similarItems: []
            }
        })
        getContent()
    }, [article.id])

    return (
        <>
            <Head>
                <title>{article.title}</title>
                <meta name="description" content={`${article.title} | ${seoDefault.title}`} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={`${article.title} | ${seoDefault.title}`} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={`${article.title} | ${seoDefault.title}`} />
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
                                { text: article.tags[0].name, url: `/articles/${article.tags[0].id}` },
                                { text: article.title },
                            ]}
                        />
                    </div>
                    <div className="mt-4 px-4 flex items-center gap-[4px] cursor-pointer" onClick={() => router.push(`/articles/${article.tags[0].id}`)}>
                        <ArrowLeftCircleIcon className="h-[16px] text-primary-darker" />
                        <span className="text-sm text-primary-darker">返回列表</span>
                    </div>
                    <div className="lg:flex lg:gap-12">
                        <div className="lg:flex-1">
                            <article className="mt-4 px-4">
                                <h2 className="text-3xl lg:text-4xl text-black font-semibold">{article.title}</h2>
                                <section className="mt-2 flex gap-4 items-start">
                                    <div>
                                        <div className="text-sm text-secondary font-light italic">{dayjs(article.publish_date).format('YYYY/MM/DD')}</div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {article.tags.map((tag: any, i: number, arr: any[]) => {
                                                return (
                                                    <div key={tag.id} className={clsx("text-xs text-secondary px-2 py-1 bg-primary rounded-md", i !== arr.length - 1 ? "mr-[4px]" : '')}>
                                                        <span>{tag.name}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="ml-auto flex gap-[4px] items-center cursor-pointer rounded-md px-2 py-1 border border-primary-darkest" onClick={() => handleShare()}>
                                        <ShareIcon className="h-[22px] text-primary-darkest" />
                                        <div className="text-sm text-primary-darkest">分享</div>
                                    </div>
                                </section>
                                {article.cover ?
                                    <div className="mt-4 flex justify-center">
                                        <Image
                                            src={article.cover}
                                            alt={article.title}
                                            width={1600}
                                            height={900}
                                            className="object-contain aspect-[16/9]"
                                        />
                                    </div> : <></>
                                }
                                <section className="mt-8 reset-all article-content">
                                    <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
                                    {/* <QuillContentWrapper content={article.content} /> */}
                                </section>
                                <section className="mt-8">
                                    <div className="flex gap-8">
                                        <div className="hover:opacity-[0.75] cursor-pointer justify-center flex gap-[4px] border border-secondary rounded-md px-4 py-2" onClick={() => handleShare()}>
                                            <ShareIcon className="w-[24px] text-primary-darkest" />
                                            <span className="text-primary-darkest">分享</span>
                                        </div>
                                        <div className="hover:opacity-[0.75] cursor-pointer justify-center flex gap-[4px] border border-primary-darker rounded-md px-4 py-2" onClick={() => openLineAtAccount()}>
                                            <ArrowTopRightOnSquareIcon className="w-[24px] text-primary-darker" />
                                            <span className="text-primary-darker">瞭解更多</span>
                                        </div>
                                    </div>
                                </section>
                                <section className="mt-8 mt-4">
                                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-8 items-center w-full">
                                        <div
                                            className={clsx("hover:opacity-[0.75] mr-auto gap-[8px] items-center text-primary-darkest cursor-pointer", content.previousItem.id ? 'flex': 'hidden')}
                                            onClick={() => router.push(`/articles/${article.tags[0].id}/${content.previousItem.id}`)}
                                        >
                                            <ArrowLeftCircleIcon className="w-[24px] shrink-0" />
                                            <div>上一篇: {content.previousItem.title}</div>
                                        </div>
                                        <div
                                            className={clsx("hover:opacity-[0.75] ml-auto gap-[8px] items-center text-primary-darkest cursor-pointer", content.nextItem.id ? 'flex': 'hidden')}
                                            onClick={() => router.push(`/articles/${article.tags[0].id}/${content.nextItem.id}`)}
                                        >
                                            <div>下一篇: {content.nextItem.title}</div>
                                            <ArrowRightCircleIcon className="w-[24px] shrink-0" />
                                        </div>
                                    </div>
                                </section>
                            </article>
                        </div>
                        <section className="lg:w-[320px] px-4 lg:px-0">
                            <div className="lg:mt-0 lg:border-none lg:pt-0 mt-8 pt-8 border-t border-t-[#ccc]">
                                <div className="flex items-center gap-[8px]">
                                    <div className="w-[4px] h-[24px] bg-primary-dark"></div>
                                    <div className="text-primary-darker text-2xl">延伸閱讀</div>
                                </div>
                                <div className="mt-8 flex flex-col">
                                    {content.similarItems.map((item: any) => {
                                        return (
                                            <div key={item.id} className="cursor-pointer" onClick={() => router.push(`/articles/${article.tags[0].id}/${item.id}`)}>
                                                <div className="flex justify-between gap-4 pt-4 pb-4 border-b border-b-[#ccc]">
                                                    <div className="flex-1 w-[70%]">
                                                        <div className="text-primary-darkest text-lg hover:opacity-[0.8]">{item.title}</div>
                                                        {/* <div className="truncate mt-2 text-sm">{item.subtitle}</div> */}
                                                    </div>
                                                    {item.cover ?
                                                        <div className="shrink-0">
                                                            <Image
                                                                src={item.cover}
                                                                alt={item.title}
                                                                width={140}
                                                                height={70}
                                                                className="object-cover aspect-[16/9]"
                                                            />
                                                        </div> :
                                                        <></>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}