import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import formatTextareaContent from '@/lib/utils/formatTextareaContent'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      image: '',
      content: '',
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/aboutus/1`
      })
      if (res.code === 0 && res.data) {
        setData(res.data)
      } else {
        setData([])
      }
    }

    useEffect(() => {
        getData()
    }, [])

  return (
    <LayoutAdmin>
      <form className="mx-auto max-w-4xl">
        <Heading>關於我們管理</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>圖片</Subheading>
            </div>
            <div>
              <img
                className="w-[148px] rounded-lg shadow w-full object-contain"
                src={data.image}
                alt=""
              />
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>
                  文案
                </Subheading>
            </div>
            <div>
                <Text dangerouslySetInnerHTML={{ __html: formatTextareaContent(data.content) }}></Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push(`/admin/home/aboutus/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
