import Breadcrumb from "@/components/client/Breadcrumb";
import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import { Select } from "@/components/common/select";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import useApi, { defaultInstance } from "@/lib/hooks/useApi";
import formatTextareaContent from "@/lib/utils/formatTextareaContent";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
import { ArrowLeftCircleIcon, ArrowTopRightOnSquareIcon, ShareIcon, TagIcon } from "@heroicons/react/16/solid";
import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

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
        }
    }

    const id = params ? params.id as string : ''

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
        props
    }
}

type Props = {
    article: any,
}

export default function Page(props: Props) {
    const { article } = props
    const router = useRouter()

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
              title: article.title,
              text: article.subtitle,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.id}`,
            })
              .then(() => console.log('Successfully shared'))
              .catch((error) => console.error('Error sharing:', error));
          } else {
            console.log('Web Share API is not supported in this browser.');
          }
    }

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
                                { text: article.title },
                            ]}
                        />
                    </div>
                    <div className="mt-4 px-4 flex items-center gap-[4px] cursor-pointer" onClick={() => router.back()}>
                        <ArrowLeftCircleIcon className="h-[16px] text-primary-darker" />
                        <span className="text-sm text-primary-darker">返回列表</span>
                    </div>
                    {article.cover ?
                        <div className="mt-4">
                            <Image
                                src={article.cover}
                                alt={article.title}
                                width={500}
                                height={500}
                                className="object-contain"
                            />
                        </div> : <></>
                    }
                    <div className="mt-4 px-4">
                        <h2 className="text-2xl lg:text-3xl text-primary-darkest font-semibold">{article.title}</h2>
                        <div className="mt-2 text-sm text-secondary font-light italic">{dayjs(article.publish_date).format('YYYY/MM/DD')}</div>
                        <article className="mt-8">
                            <QuillContentWrapper content={article.content} />
                        </article>

                        {/* <div className="flex mt-2 text-secondary">
                            <TagIcon className="w-[14px] mr-1" />
                            {article.tags && Array.isArray(article.tags) ?
                                article.tags.map((tag: any, i: number, arr: any[]) => {
                                return (
                                    <div key={tag.id} className="text-sm">
                                        <span>#{tag.name}</span>
                                        {i !== arr.length - 1 ? <span className="mr-[4px]"></span> : ''}
                                    </div>
                                )
                                }) : []}
                        </div> */}
                        <div className="mt-8 pb-4">
                            <div className="flex gap-8">
                                <div className="cursor-pointer justify-center flex gap-[4px] border border-secondary rounded-md px-4 py-2" onClick={() => handleShare()}>
                                    <ShareIcon className="w-[24px] text-secondary" />
                                    <span className="text-secondary">分享此頁面</span>
                                </div>
                                <div className="cursor-pointer justify-center flex gap-[4px] border border-primary-darker rounded-md px-4 py-2" onClick={() => openLineAtAccount()}>
                                    <ArrowTopRightOnSquareIcon className="w-[24px] text-primary-darker" />
                                    <span className="text-primary-darker">瞭解更多</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}