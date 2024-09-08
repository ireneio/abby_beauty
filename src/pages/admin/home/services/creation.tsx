import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMemo, useRef } from 'react'
import Swal from 'sweetalert2'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import { Text } from '@/components/common/text'
import { Select } from '@/components/common/select'
import { Textarea } from '@/components/common/textarea'

type Inputs = {
    image: any[];
    title: string;
    content: string;
    url: string;
    url_open_type: string;
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
            content: '',
            url: '',
            url_open_type: '',
        }
    })

    const watchImage = watch('image')

    const watchTitle = watch('title')

    const watchContent = watch('content')

    const watchUrl = watch('url')

    const watchUrlOpenType = watch('url_open_type')

    const submitDisabled = useMemo(() => {
        const must = watchImage.length <= 0 || watchTitle.length <= 0 || watchContent.length <= 0
        if (watchUrl !== '') {
            return must || watchUrlOpenType.length <= 0
        }
        return must
    }, [watchImage, watchUrl, watchUrlOpenType, watchTitle, watchContent])

    const create = async (data: any) => {
        let image = ''

        if (imageUploaderRef.current) {
            const list = await imageUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                image = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/services`,
            data: {
                url: data.url,
                url_open_type: data.url_open_type,
                image,
                title: data.title,
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

        const res = await create({
            ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/home/services/${res.data.id}/view`)
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

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增服務項目</Heading>
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
                        imageSizeRecommended='方形 (如: 500x500)'
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

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        內容
                        <RequiredMark />
                    </Subheading>
                    <Text>介紹此服務項目的相關內容</Text>
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
                        連結
                    </Subheading>
                    <Text>點擊圖片開啟的連結</Text>
                </div>
                <div>
                    <Input {...register('url')} aria-label="連結" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        連結開啟類型
                        {watchUrl ? <RequiredMark /> : null}
                    </Subheading>
                    <Text>點擊圖片開啟的連結的連結類型，分為『在同分頁開啟』或『以新分頁開啟』</Text>
                </div>
                <div>
                    <Select {...register('url_open_type')} aria-label="連結開啟類型">
                        <option value="_self">在同分頁開啟</option>
                        <option value="_blank">以新分頁開啟</option>
                        <option value="">無</option>
                    </Select>
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/home/services')}>
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
