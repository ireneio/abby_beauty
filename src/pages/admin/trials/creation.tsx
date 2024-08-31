import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'

import WysiwygEditor from '@/components/admin/WysiwygEditor'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import generateRandomAlphabetString from '@/lib/utils/generateRandomAlphabetString'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRef } from 'react'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'

type Inputs = {
    title: string,
    title_short: string,
    subtitle: string,
    content: string,
    images: any[],
    price_discount: string,
    price_original: string,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()

    const multipleImageUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            title: '',
            title_short: '',
            content: '',
        }
    })

    const submitDisabled = !watch('title') || !watch('title_short') || !watch('content')

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/trials`,
            data,
        })
        return res
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        let imageUrlArr: { order: number; url: string }[] = []

        if (multipleImageUploaderRef.current) {
            const list = await multipleImageUploaderRef.current.uploadFiles()
            imageUrlArr = [...list]
        }

        const res = await create({
            ...data,
            slug: generateRandomAlphabetString(5),
            images: imageUrlArr,
        })

        if (res.code === 0) {
            router.replace(`/admin/trials/${res.data.id}/view`)
        } else {
            dispatch(openAlert({ title: `錯誤(${res.code})` }))
        }
    }

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增體驗課程</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                    圖片
                    <RequiredMark />
                    </Subheading>
                </div>
                <div className='space-y-4'>
                    <MultipleImageUploader
                        ref={multipleImageUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='image_list'
                        imageSizeRecommended='方形(如: 500x500)'
                        maxCount={6}
                        hint="可拖曳進行排序，排列順序為第一張的圖片將顯示為該產品的封面圖"
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        縮寫標題
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('title_short')} aria-label="縮寫標題" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        完整標題
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('title')} aria-label="完整標題" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        副標題
                    </Subheading>
                </div>
                <div>
                    <Input {...register('subtitle')} aria-label="副標題" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        內容
                    </Subheading>
                </div>
                <div>
                    <WysiwygEditor
                        value={watch('content')}
                        onChange={(value) => setValue('content', value)}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/products')}>
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
