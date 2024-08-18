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
  title: '課程',
  description: '查看課程',
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [classs, setClass] = useState<any>({
      id: '',
      name: '',
      minutes: '',
      image_cover: '',
      class_type_name: '',
    })

    const getClass = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/classes/${router.query.id}`
      })
      if (res.code === 0 && res.data && res.data.length > 0) {
        setClass(res.data[0])
      } else {
        setClass([])
      }
    }

  useEffect(() => {
    if (router.query.id) {
        getClass()
    }
  }, [router.query])

  return (
    <LayoutAdmin>
      <form className="mx-auto max-w-4xl">
        <Heading>查看課程</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
            <Subheading>封面圖</Subheading>
            </div>
            <div className='space-y-4'>
                {classs.image_cover ?
                  <img className="aspect-[3/2] rounded-lg shadow w-full object-contain" src={classs.image_cover} alt="" /> :
                  null
                }
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>名稱</Subheading>
            </div>
            <div>
              <Text>{classs.name}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        系列
                    </Subheading>
                </div>
                <div>
                    <Text>{classs.class_type_name}</Text>
                </div>
            </section>

            <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
            <Subheading>時長</Subheading>
            <Text>單位: 分鐘</Text>
            </div>
            <div>
              <Text>{classs.minutes}</Text>
            </div>
        </section>

        <Divider className="my-10" soft />

        {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>描述</Subheading>
        </div>
        <div>
          <Text>{classs.description}</Text>
        </div>
      </section> */}

        {/* <Divider className="my-10" soft /> */}

        {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>開放預約</Subheading>
          </div>
          <div>
            <Badge color={classs.available_for_reservation ? 'lime' : 'zinc'}>
              {classs.available_for_reservation ? '可預約' : '不可預約'}
            </Badge>
          </div>
        </section>

        <Divider className="my-10" soft /> */}

        <div className="flex justify-end gap-4">
          <Button type="reset" plain onClick={() => router.push('/admin/classes')}>
            返回列表
          </Button>
          <Button type="reset" plain onClick={() => router.push(`/admin/classes/${router.query.id}/edit`)}>
            編輯
          </Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
