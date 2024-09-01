import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      name: '',
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/article_tags/${router.query.id}`
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
        <Heading>查看文章分類</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    名稱
                </Subheading>
            </div>
            <div>
                <Text>{data.name}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push('/admin/articles/tags')}>
            取消
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/articles/tags/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
