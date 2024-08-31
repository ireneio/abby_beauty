import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Text } from '@/components/common/text'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const [data, setData] = useState<any>({
      name_zh: '',
      name_en: '',
      size: '',
      sku: '',
      usage: '',
      ingredients: '',
      features: '',
      target_users: '',
      product_type_id: null,
      product_type_name: '',
      hidden: false,
      images: [],
    })

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/products/${router.query.id}`
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
          <title>產品管理</title>
          <meta name="description" content="查看產品" />
      </Head>
      <LayoutAdmin>
        <form className="mx-auto max-w-4xl">
          <Heading>查看產品</Heading>
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
                <Subheading>中文名稱</Subheading>
              </div>
              <div>
                <Text>{data.name_zh}</Text>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>英文名稱</Subheading>
              </div>
              <div>
                <Text>{data.name_en}</Text>
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
              <Text>{data.product_type_name}</Text>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                  <Subheading>規格</Subheading>
              </div>
              <div>
                <div className='ql-editor'>
                  <div dangerouslySetInnerHTML={{ __html: data.size }}></div>
                </div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
              <Subheading>產品特點</Subheading>
              </div>
              <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.features }}></div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>成份內容</Subheading>
              </div>
              <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.ingredients }}></div>
              </div>
          </section>

          <Divider className="my-10" soft />

          {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>適用對象</Subheading>
              </div>
              <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.target_users }}></div>
              </div>
          </section>

          <Divider className="my-10" soft /> */}

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>使用方法</Subheading>
              </div>
              <div className='ql-editor'>
                <div dangerouslySetInnerHTML={{ __html: data.usage }}></div>
              </div>
          </section>

          <Divider className="my-10" soft />

          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>上架狀態</Subheading>
            </div>
            <div>
              <Badge color={data.hidden ? 'zinc' : 'lime'}>
                {data.hidden ? '已下架' : '已上架'}
              </Badge>
            </div>
          </section>

          <Divider className="my-10" soft />

          <div className="flex justify-end gap-4">
            <Button type="reset" plain href="/admin/products">
              取消
            </Button>
            <Button type="reset" plain href={`/admin/products/${router.query.id}/edit`}>
              編輯
            </Button>
          </div>
        </form>
      </LayoutAdmin>
    </>
  )
}
