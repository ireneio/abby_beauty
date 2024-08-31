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
      avatar: '',
      customer_name: '',
      content: '',
      stars: '',
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/customer_comments/${router.query.id}`
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
        <Heading>查看客戶好評</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>大頭貼</Subheading>
            </div>
            <div>
              <img
                className="w-[64px] aspect-[1/1] rounded-full object-cover"
                src={data.avatar}
                alt=""
              />
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                    客戶名稱
                </Subheading>
            </div>
            <div>
                <Text>{data.customer_name}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>
                  內容
              </Subheading>
              <Text>客戶的好評內容</Text>
            </div>
            <div>
                <Text>{data.content}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        好評星級
                    </Subheading>
                    <Text>1~5顆星</Text>
                </div>
                <div>
                    <Text>{data.stars}</Text>
                </div>
            </section>

            <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push('/admin/home/comments')}>
            取消
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/home/comments/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
