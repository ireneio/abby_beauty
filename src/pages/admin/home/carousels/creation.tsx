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

type Inputs = {
    image_mobile: any[];
    image_desktop: any[];
    url: string;
    url_open_type: string;
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const imageMobileUploaderRef = useRef<any>(null)

    const imageDesktopUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            image_mobile: [],
            image_desktop: [],
            url: '',
            url_open_type: '',
        }
    })

    const watchMobile = watch('image_mobile')

    const watchDesktop = watch('image_desktop')

    const watchUrl = watch('url')

    const watchUrlOpenType = watch('url_open_type')

    const submitDisabled = useMemo(() => {
        const must = watchMobile.length <= 0 || watchDesktop.length <= 0
        if (watchUrl !== '') {
            return must || watchUrlOpenType.length <= 0
        }
        return must
    }, [watchMobile, watchDesktop, watchUrl, watchUrlOpenType])

    const create = async (data: any) => {
        let image_mobile = ''
        let image_desktop = ''

        if (imageMobileUploaderRef.current) {
            const list = await imageMobileUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                image_mobile = list[0].url
            }
        }

        if (imageDesktopUploaderRef.current) {
            const list = await imageDesktopUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                image_desktop = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/banners`,
            data: {
                url: data.url,
                url_open_type: data.url_open_type,
                image_mobile,
                image_desktop,
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
            router.replace(`/admin/home/carousels/${res.data.id}/view`)
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
            <Heading>新增輪播圖</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        圖片(手機版)
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={imageMobileUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='image_mobile'
                        imageSizeRecommended='直幅, 比例: 9/12 (如: 600x900)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        圖片(桌機版)
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={imageDesktopUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='image_desktop'
                        imageSizeRecommended='橫幅, 比例: 2/1 (如: 1920x960)'
                        maxCount={1}
                    />
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
                <Button type="reset" plain onClick={() => router.push('/admin/home/carousels')}>
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
