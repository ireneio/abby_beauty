import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import type { Metadata } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      name: '',
      description: '',
      image_cover: '',
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/product_types/${router.query.id}`
      })
      if (res.code === 0 && res.data && res.data.length > 0) {
        setData(res.data[0])
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
    <>
      <Head>
        <title>產品系列管理</title>
        <meta name="description" content="查看產品系列" />
      </Head>
      <LayoutAdmin>
        <form className="mx-auto max-w-4xl">
          <Heading>查看產品系列</Heading>
          <Divider className="my-10 mt-6" />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
              <Subheading>封面圖</Subheading>
              </div>
              <div className='space-y-4'>
                <div className='flex flex-wrap gap-4'>
                  {data.image_cover ?
                    <img className="w-[148px] aspect-[1/1] rounded-lg shadow w-full object-contain" src={data.image_cover} alt="" /> :
                    null
                  }
                </div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>名稱</Subheading>
              </div>
              <div>
                <Text>{data.name}</Text>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>系列介紹</Subheading>
              </div>
              <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <div className="flex justify-end gap-4">
            <Button type="reset" plain onClick={() => router.push('/admin/product_types')}>
              取消
            </Button>
            <Button type="reset" plain onClick={() => router.push(`/admin/product_types/${router.query.id}/edit`)}>
              編輯
            </Button>
          </div>
        </form>
      </LayoutAdmin>
    </>
  )
}
