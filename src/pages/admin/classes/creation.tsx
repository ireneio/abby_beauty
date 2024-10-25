import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Text } from '@/components/common/text'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import fileToBase64 from '@/lib/utils/fileToBase64'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

type Inputs = {
    name: string,
    minutes: string,
    image_cover: string,
    image_cover_selected: any,
    available_for_reservation: boolean,
    class_type_id: number | null,
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
            class_type_id: null,
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
        Swal.fire({
            title: '加載中...',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen() {
                Swal.showLoading()
            }
        })

        const file = data.image_cover_selected && data.image_cover_selected.length > 0 ?
            data.image_cover_selected[0] :
            null
        if (file) {
            const uploadRes = await uploadFile(file)
            if (uploadRes.success && uploadRes.code === 0) {
                const updateRes = await createClass({ ...data, image_cover: uploadRes.data.url })
                if (updateRes.success && updateRes.code === 0 && updateRes.data.length > 0) {
                    router.replace(`/admin/classes/${updateRes.data[0].id}/view`)
                    Swal.close()
                    Swal.fire({
                        title: `儲存成功`,
                        icon: 'success',
                    })
                } else {
                    Swal.close()
                    Swal.fire({
                        title: `錯誤(${updateRes.code})`,
                        icon: 'error',
                    })
                }
            } else {
                Swal.close()
                Swal.fire({
                    title: `錯誤(${uploadRes.code})`,
                    icon: 'error',
                })
            }
        } else {
            const updateRes = await createClass({ ...data, image_cover: data.image_cover })
            if (updateRes.success && updateRes.code === 0 && updateRes.data.length > 0) {
                router.replace(`/admin/classes/${updateRes.data[0].id}/view`)
                Swal.close()
                Swal.fire({
                    title: `儲存成功`,
                    icon: 'success',
                })
            } else {
                Swal.close()
                Swal.fire({
                    title: `錯誤(${updateRes.code})`,
                    icon: 'error',
                })
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

    const [classTypes, setClassTypes] = useState<any[]>([])

    const getClassTypes = async () => {
        const res = await api({
            method: 'GET',
            url: '/admin/class_types'
        })
        if (res.code === 0) {
            setClassTypes(res.data.classTypes)
        } else {
            setClassTypes([])
        }
    }

    useEffect(() => {
        getClassTypes()
    }, [])

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增課程</Heading>
            <Divider className="my-10 mt-6" />

            {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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

            <Divider className="my-10" soft /> */}

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
                    <Subheading>
                        系列
                    </Subheading>
                    <Text>選擇課程系列</Text>
                </div>
                <div>
                    <Select
                        {...register('class_type_id')}
                        aria-label="選擇系列"
                    >
                        <option value="">選擇系列</option>
                        {classTypes.map((v) => {
                            return (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            )
                        })}
                    </Select>
                </div>
            </section>

            {/* <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>時長</Subheading>
                <Text>單位: 分鐘</Text>
                </div>
                <div>
                <Input {...register('minutes')} type="tel" aria-label="時長" />
                </div>
            </section> */}

            <Divider className="my-10" soft />

            {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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

            <Divider className="my-10" soft /> */}

            <div className="flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/classes')}>
                    取消
                </Button>
                <Button
                    loading={isSubmitting}
                    disabled={!watch('name')}
                    type="submit"
                >
                    儲存
                </Button>
            </div>
        </form>
    </LayoutAdmin>
  )
}
