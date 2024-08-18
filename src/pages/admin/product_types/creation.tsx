import RequiredMark from '@/components/admin/RequiredMark'
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
import Tiptap from '@/components/common/Tiptap'
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
import { ReactSortable } from "react-sortablejs";

export const metadata: Metadata = {
  title: '產品系列',
  description: '新增產品系列',
}

type Inputs = {
    name: string,
    image_list: any,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()

    const [imagePreviewList, setImagePreviewList] = useState<any[]>([])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            image_list: null,
        }
    })

    const submitDisabled = !watch('name')

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/product_types`,
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
        const imageUrlArr = []
        
        if (data.image_list) {
            for (let i = 0; i < data.image_list.length; i++) {
              if (!data.image_list[i].id) {
                const uploadRes = await uploadFile(data.image_list[i])
                imageUrlArr.push({ order: i, url: uploadRes.data.url })
              } else {
                imageUrlArr.push({ ...data.image_list[i], order: i })
              }
            }
        }

        const res = await create({
            ...data,
            image_cover: imageUrlArr.length > 0 ? imageUrlArr[0].url : '',
        })

        if (res.code === 0) {
            router.replace(`/admin/product_types/${res.data.id}/view`)
        } else {
            dispatch(openAlert({ title: `錯誤(${res.code})` }))
        }
    }

    const imageRef = useRef(null)

    const handleRemoveImagePreview = (index: number) => {
        setImagePreviewList((prev) => {
            return prev.filter((v, i) => i !== index)
        })
        const formItem: any = getValues('image_list')
        if (formItem) {
            setValue('image_list', [...formItem].filter((v, i) => i !== index) as any)
        }
    }

    const handleSetImagePreview = async (files: FileList | null) => {
        if (files) {
            let arr: string[] = []
            for (let i = 0; i < files.length; i++) {
                const base64 = await fileToBase64(files[i])
                arr = [...arr, `data:image/png;base64,${base64}`]
            }
            setImagePreviewList(arr)
        } else {
            setImagePreviewList([])
        }
    }

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增產品系列</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>封面圖</Subheading>
                </div>
                <div className='space-y-4'>
                    <ReactSortable className='flex flex-wrap gap-4' list={imagePreviewList} setList={setImagePreviewList}>
                        {imagePreviewList.map((item, i) => (
                            <div key={i} className='relative w-[148px]'>
                                <div className='absolute top-2 left-2' onClick={() => handleRemoveImagePreview(i)}>
                                    <Button className='w-[2rem] h-[2rem]'>
                                        <MinusIcon />
                                    </Button>
                                </div>
                                <img key={i} className="aspect-[1/1] rounded-lg shadow w-full object-contain" src={item} alt="" />
                            </div>
                        ))}
                    </ReactSortable>
                    <Input
                        ref={imageRef}
                        type="file"
                        accept='image/*'
                        aria-label="圖片"
                        onClick={() => {
                            if (imageRef.current) {
                                // @ts-ignore
                                imageRef.current.value = ''
                            }
                        }}
                        onChange={(e) => {                     
                            setValue('image_list', [...e.target.files as any] as any)
                            handleSetImagePreview(e.target.files)
                        }}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        名稱
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('name')} aria-label="名稱" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
            <Button type="reset" plain onClick={() => router.push('/admin/products')}>
                返回列表
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
