import QuillContentWrapper from '@/components/client/QuillContentWrapper'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      cover: '',
      title: '',
      subtitle: '',
      content: '',
      publish_date: '',
      start_date: '',
      end_date: '',
      tags: [],
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/articles/${router.query.id}`
      })
      if (res.code === 0 && res.data) {
        setData(res.data)
      } else {
        setData([])
      }
    }

  useEffect(() => {
    if (router.query.id) {
      getData()
    }
  }, [router.query])

  return (
    <LayoutAdmin>
      <form className="mx-auto max-w-4xl">
        <Heading>查看文章</Heading>
        <Divider className="my-10 mt-6" />

        {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>圖片</Subheading>
            </div>
            <div>
              <img
                className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-contain"
                src={data.image}
                alt=""
              />
            </div>
        </section>

        <Divider className="my-10" soft /> */}

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
              <Subheading>
                  顯示的日期
              </Subheading>
              <Text>顯示於文章內的發佈日期</Text>
          </div>
          <div>
            {data.publish_date && dayjs(data.publish_date).isValid() ?
              <Text>{dayjs(data.publish_date).format('YYYY-MM-DD')}</Text> :
              null
            }
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    標題
                </Subheading>
            </div>
            <div>
                <Text>{data.title}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    副標題
                </Subheading>
            </div>
            <div>
              <Text>{data.subtitle}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    內容
                </Subheading>
            </div>
            <div>
              <QuillContentWrapper content={data.content} />
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    起始日期
                </Subheading>
                <Text>文章發佈的起始日期</Text>
            </div>
            <div>
              {data.start_date && dayjs(data.start_date).isValid() ?
                <Text>{dayjs(data.start_date).format('YYYY-MM-DD')}</Text> :
                null
              }
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    結束日期
                </Subheading>
                <Text>文章發佈的結束日期</Text>
            </div>
            <div>
              {data.end_date && dayjs(data.end_date).isValid() ?
                <Text>{dayjs(data.end_date).format('YYYY-MM-DD')}</Text> :
                null
              }
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    分類
                </Subheading>
            </div>
            <div>
                <Text>{data.tags.map((tag: any) => tag.name).join(',')}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push('/admin/articles/posts')}>
            取消
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/articles/posts/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
