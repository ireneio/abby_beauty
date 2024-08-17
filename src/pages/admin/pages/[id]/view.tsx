import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const metadata: Metadata = {
  title: '自訂頁面',
  description: '查看自訂頁面',
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      title: '',
      content: '',
      allow_access: false,
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/pages/${router.query.id}`
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
        <Heading>查看自訂頁面</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>標題</Subheading>
            </div>
            <div>
              <Text>{data.title}</Text>
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
                  <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>發佈狀態</Subheading>
            </div>
            <div>
              <Badge color={data.allow_access ? 'lime' : 'zinc'}>
                {data.allow_access ? '已發佈' : '未發佈'}
              </Badge>
            </div>
          </section>

          <Divider className="my-10" soft />


        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            <Link href="/admin/pages">
                返回列表
            </Link>
          </Button>
          <Button type="reset" plain>
            <Link href={`/admin/pages/${router.query.id}/edit`}>
              編輯
            </Link>
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
