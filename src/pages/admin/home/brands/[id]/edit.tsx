import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import Swal from 'sweetalert2'

type Inputs = {
  image: any[];
  title: string;
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const imageUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
          image: [],
          title: '',
        }
    })

    const watchImage = watch('image')

    const watchTitle = watch('title')

    const submitDisabled = watchImage.length <= 0 || watchTitle.length <= 0

    const update = async (data: any) => {
        let image = ''

        if (imageUploaderRef.current) {
            const list = await imageUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                image = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/brands/${router.query.id}`,
            data: {
              image,
              title: data.title,
            },
        })
        return res
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        Swal.fire({
            title: '加載中...',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen() {
                Swal.showLoading()
            }
        })

        const res = await update({
          ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/home/brands/${router.query.id}/view`)
            Swal.close()
            Swal.fire({
                title: `更新成功`,
                icon: 'success',
            })
        } else {
            Swal.close()
            Swal.fire({
                title: `錯誤(${res.code})`,
                icon: 'error',
            })
        }
    }

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/brands/${router.query.id}`,
      })
      return res
    }

    useEffect(() => {
      if (router.query.id) {
        getData().then((res) => {
          if (res.code === 0 && res.data) {
            const data = res.data
            setValue('title', data.title)
            if (imageUploaderRef.current) {
              imageUploaderRef.current.setList([{ url: data.image }])
            }
            setValue('image', [data.image])
          }
        })
      }
    }, [router.query.id])

  return (
    <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯品牌價值</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        圖片
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={imageUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='image'
                        imageSizeRecommended='直幅, 橫福, 或方形皆可 (如: 500x500, 1920x1080, 900x1600)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        標題
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('title')} aria-label="標題" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
              <Button type="reset" plain onClick={() => router.push(`/admin/home/brands`)}>
                取消
              </Button>
              <Button type="reset" plain onClick={() => router.push(`/admin/home/brands/${router.query.id}/view`)}>
                查看
              </Button>
              <Button
                  loading={isSubmitting}
                  disabled={submitDisabled}
                  type="submit"
              >
                  儲存
            </Button>
            </div>
        </form>
    </LayoutAdmin>
  )
}
