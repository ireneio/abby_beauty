import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import Swal from 'sweetalert2'
import { Text } from '@/components/common/text'
import { Select } from '@/components/common/select'
import { Textarea } from '@/components/common/textarea'

type Inputs = {
  image: any[];
  content: string;
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
          content: '',
        }
    })

    const watchImage = watch('image')

    const watchContent = watch('content')

    const submitDisabled = watchImage.length <= 0 || watchContent.length <= 0

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
            url: `/admin/aboutus/1`,
            data: {
              image,
              content: data.content,
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
            router.replace(`/admin/home/aboutus`)
            Swal.close()
            Swal.fire({
                title: `儲存成功`,
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
        url: `/admin/aboutus/1`,
      })
      return res
    }

    useEffect(() => {
        getData().then((res) => {
            if (res.code === 0 && res.data) {
              const data = res.data
              setValue('content', data.content)
              if (imageUploaderRef.current) {
                imageUploaderRef.current.setList([{ url: data.image }])
              }
              setValue('image', [data.image])
            }
        })
    }, [])

  return (
    <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯加入我們</Heading>
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
                        imageSizeRecommended='橫福 , 比例: 16/9 (如: 1920x1080)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        文案
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Textarea {...register('content')} rows={35} aria-label="文案" />
                    <div className='flex justify-between'>
                        <Text>建議不超過 500 字</Text>
                        <Text>字數: {watch('content').length}</Text>
                    </div>
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
              <Button type="reset" plain onClick={() => router.push(`/admin/home/aboutus`)}>
                取消
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
