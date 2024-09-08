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
    avatar: any[];
    customer_name: string;
    content: string;
    stars: string;
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const avatarUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
          avatar: [],
          customer_name: '',
          content: '',
          stars: '',
        }
    })

    const watchAvatar = watch('avatar')
    const watchCustomerName = watch('customer_name')
    const watchContent = watch('content')
    const watchStars = watch('stars')

    const submitDisabled = watchAvatar.length <= 0 ||
        watchCustomerName.length <= 0 ||
        watchContent.length <= 0 ||
        !watchStars ||
        watchStars.length <= 0

    const update = async (data: any) => {
        let avatar = ''

        if (avatarUploaderRef.current) {
            const list = await avatarUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                avatar = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/customer_comments/${router.query.id}`,
            data: {
              avatar,
              customer_name: data.customer_name,
              content: data.content,
              stars: data.stars,
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
            router.replace(`/admin/home/comments/${router.query.id}/view`)
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
        url: `/admin/customer_comments/${router.query.id}`,
      })
      return res
    }

    useEffect(() => {
      if (router.query.id) {
        getData().then((res) => {
          if (res.code === 0 && res.data) {
            const data = res.data
            setValue('customer_name', data.customer_name)
            setValue('content', data.content)
            if (avatarUploaderRef.current) {
              avatarUploaderRef.current.setList([{ url: data.avatar }])
            }
            setValue('avatar', [data.avatar])
            setValue('stars', data.stars)
          }
        })
      }
    }, [router.query.id])

  return (
    <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯客戶好評</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        大頭貼
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={avatarUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='avatar'
                        imageSizeRecommended='方形 (如: 500x500)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        客戶名稱
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('customer_name')} aria-label="客戶名稱" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        內容
                        <RequiredMark />
                    </Subheading>
                    <Text>客戶的好評內容</Text>
                </div>
                <div>
                    <Textarea {...register('content')} rows={10} aria-label="內容" />
                    <div className='flex justify-between'>
                        <Text>建議不超過 150 字</Text>
                        <Text>字數: {watch('content').length}</Text>
                    </div>
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        好評星級
                        <RequiredMark />
                    </Subheading>
                    <Text>1~5顆星</Text>
                </div>
                <div>
                    <Select
                        {...register('stars')}
                        aria-label='好評星級'
                    >
                        <option value="">選擇好評星級</option>
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                    </Select>
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
              <Button type="reset" plain onClick={() => router.push(`/admin/home/comments`)}>
                取消
              </Button>
              <Button type="reset" plain onClick={() => router.push(`/admin/home/comments/${router.query.id}/view`)}>
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
