import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      title: '',
      title_short: '',
      subtitle: '',
      content: '',
      images: [],
      price_discount: '',
      price_original: '',
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/trials/${router.query.id}`
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
        <Heading>查看體驗課程</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
              <Subheading>圖片</Subheading>
              </div>
              <div className='space-y-4'>
                <div className='flex flex-wrap gap-4'>
                  {data.images.map((v: any, i: number) => {
                    return (
                      <img key={i} className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-contain" src={v.url} alt="" />
                    )
                  })}
                </div>
              </div>
          </section>

          <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>完整標題</Subheading>
            </div>
            <div>
              <Text>{data.title}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>縮寫標題</Subheading>
            </div>
            <div>
              <Text>{data.title_short}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>副標題</Subheading>
            </div>
            <div>
              <Text>{data.subtitle}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>體驗價</Subheading>
            </div>
            <div>
              <Text>{data.price_discount}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>原價</Subheading>
            </div>
            <div>
              <Text>{data.price_original}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>
                內容
              </Subheading>
            </div>
            <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
        </section>

          <Divider className="my-10" soft />

          <div className="flex justify-end gap-4">
            <Button type="reset" plain onClick={() => router.push('/admin/trials')}>
              取消
            </Button>
            <Button type="reset" plain onClick={() => router.push(`/admin/trials/${router.query.id}/edit`)}>
              編輯
            </Button>
          </div>
      </form>
    </LayoutAdmin>
  )
}
