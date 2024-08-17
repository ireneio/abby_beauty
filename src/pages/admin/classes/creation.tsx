import { Button } from '@/components/common/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/common/checkbox'
import { Divider } from '@/components/common/divider'
import { Label } from '@/components/common/fieldset'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Switch, SwitchField } from '@/components/common/switch'
import { Text } from '@/components/common/text'
import { Textarea } from '@/components/common/textarea'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import fileToBase64 from '@/lib/utils/fileToBase64'
import { MinusIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '課程',
  description: '新增課程',
}

type Inputs = {
    name: string,
    minutes: string,
    image_cover: string,
    image_cover_selected: any,
    available_for_reservation: boolean,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()
    const imageRef = useRef(null)

    const [classs, setClass] = useState<any>({
        id: '',
        name: '',
        minutes: '',
        image_cover: '',
        image_preview: '',
    })

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            minutes: '',
            image_cover: '',
            available_for_reservation: true,
            image_cover_selected: null,
        }
    })

    const createClass = async (data: any) => {    
        const res = await api({
        method: 'POST',
        url: `/admin/classes`,
        data,
        })
        return res
    }

    const uploadFile = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file)
        const res = await api({
            method: 'POST',
            url: `/admin/files`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        })
        return res
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const file = data.image_cover_selected && data.image_cover_selected.length > 0 ?
            data.image_cover_selected[0] :
            null
        if (file) {
            const uploadRes = await uploadFile(file)
            if (uploadRes.success && uploadRes.code === 0) {
                const updateRes = await createClass({ ...data, image_cover: uploadRes.data.url })
                if (updateRes.success && updateRes.code === 0 && updateRes.data.length > 0) {
                    router.replace(`/admin/classes/${updateRes.data[0].id}/view`)
                } else {
                    dispatch(openAlert({ title: `錯誤(${updateRes.code})` }))
                }
            } else {
                dispatch(openAlert({ title: `錯誤(${uploadRes.code})` }))
            }
        } else {
            const updateRes = await createClass({ ...data, image_cover: data.image_cover })
            if (updateRes.success && updateRes.code === 0 && updateRes.data.length > 0) {
                router.replace(`/admin/classes/${updateRes.data[0].id}/view`)
            } else {
                dispatch(openAlert({ title: `錯誤(${updateRes.code})` }))
            }
        }
    }

    const handleRemoveImagePreview = () => {
        setValue('image_cover_selected', [])
        setClass((prev: any) => ({ ...prev, image_preview: '' }))
    }

    const handleSetImagePreview = async (files: any) => {
        const base64 = await fileToBase64(files[0])
        setClass((prev: any) => ({ ...prev, image_preview: `data:image/png;base64,${base64}` }))
    }

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增課程</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>封面圖</Subheading>
                </div>
                <div className='space-y-4'>
                    {classs.image_preview ?
                        <div className='relative'>
                            <div className='absolute top-2 left-2' onClick={() => handleRemoveImagePreview()}>
                                <Button className='w-[2rem] h-[2rem]'>
                                    <MinusIcon />
                                </Button>
                            </div>
                            <img className="aspect-[3/2] rounded-lg shadow w-full object-contain" src={classs.image_preview} alt="" />
                        </div> :
                        null
                    }
                    <Input
                        ref={imageRef}
                        type="file"
                        accept='image/*'
                        aria-label="封面圖"
                        onChange={(e) => {
                            setValue('image_cover_selected', e.target.files)
                            handleSetImagePreview(e.target.files)
                        }}
                        onClick={() => {
                            if (imageRef.current) {
                                // @ts-ignore
                                imageRef.current.value = ''
                            }
                        }}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>名稱</Subheading>
                </div>
                <div>
                <Input {...register('name')} aria-label="名稱" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>時長</Subheading>
                <Text>單位: 分鐘</Text>
                </div>
                <div>
                <Input {...register('minutes')} type="number" aria-label="時長" />
                </div>
            </section>

            <Divider className="my-10" soft />

            {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
            <Subheading>描述</Subheading>
            </div>
            <div>
            <Textarea {...register('description')} aria-label="描述" />
            </div>
        </section> */}

            {/* <Divider className="my-10" soft /> */}

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Subheading>開放預約</Subheading>
            </div>
            <div>
                <SwitchField>
                    <Switch
                    onChange={(checked) => {
                        setValue('available_for_reservation', checked)
                    }}
                    checked={watch('available_for_reservation') === true}
                    />
                </SwitchField>
            </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
            <Button type="reset" plain>
                <Link href="/admin/classes">
                    返回列表
                </Link>
            </Button>
            <Button
                loading={isSubmitting}
                disabled={!watch('name') || !watch('minutes') || !watch('image_cover_selected')}
                type="submit"
            >儲存</Button>
            </div>
        </form>
    </LayoutAdmin>
  )
}
