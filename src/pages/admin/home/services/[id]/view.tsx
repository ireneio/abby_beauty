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
      image: '',
      title: '',
      content: '',
      url: '',
      url_open_type: ''
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/services/${router.query.id}`
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
        <Heading>查看服務項目</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>圖片</Subheading>
            </div>
            <div>
              <img
                className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-cover"
                src={data.image}
                alt=""
              />
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
                  內容
              </Subheading>
              <Text>介紹此服務項目的相關內容</Text>
            </div>
            <div>
                <Text>{data.content}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>連結</Subheading>
              <Text>點擊圖片開啟的連結</Text>
            </div>
            <div>
              {data.url ?
                <Text
                  className='underline'
                  onClick={() => window.open(data.url, '_blank')}
                >{data.url}</Text> :
                null
              }
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>連結開啟類型</Subheading>
              <Text>點擊圖片開啟的連結的連結類型，分為『在同分頁開啟』或『以新分頁開啟』</Text>
            </div>
            <div>
              {data.url_open_type ?
                <Text>{data.url_open_type === '_blank' ? '以新分頁開啟' : '在同分頁開啟'}</Text>
                : null
              }
            </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push('/admin/home/services')}>
            取消
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/home/services/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
