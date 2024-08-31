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
      image_mobile: '',
      image_desktop: '',
      url: '',
      url_open_type: ''
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/banners/${router.query.id}`
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
        <Heading>查看輪播圖</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>圖片(手機版)</Subheading>
            </div>
            <div>
              <img
                className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-contain"
                src={data.image_mobile}
                alt=""
              />
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>圖片(桌機版)</Subheading>
            </div>
            <div>
              <img
                className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-contain"
                src={data.image_desktop}
                alt=""
              />
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
          <Button type="reset" plain onClick={() => router.push('/admin/home/carousels')}>
            取消
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/home/carousels/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
