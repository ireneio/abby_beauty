import DialogDeleteConfirm from '@/components/admin/DialogDeleteConfirm'
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
  title: '課程系列',
  description: '編輯課程系列',
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

    const update = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/class_types/${router.query.id}`,
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
      
        const res = await update({
            ...data,
            image_cover: imageUrlArr.length > 0 ? imageUrlArr[0].url : '',
        })

        if (res.code === 0) {
            router.replace(`/admin/class_types/${router.query.id}/view`)
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

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/class_types/${router.query.id}`,
      })
      return res
    }

    useEffect(() => {
      if (router.query.id) {
        getData().then((res) => {
          if (res.code === 0 && res.data.length > 0) {
            const data = res.data[0]
            setValue('name', data.name)
            if (data.image_cover) {
                setImagePreviewList([data.image_cover])
                setValue('image_list', [{ id: '1', url: data.image_cover }])
            }
          }
        })
      }
    }, [router.query.id])

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯課程系列</Heading>
            <Divider className="my-10 mt-6" />

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
              <Button type="reset" plain onClick={() => router.push('/admin/class_types')}>
                返回列表
              </Button>
              <Button type="reset" plain onClick={() => router.push(`/admin/class_types/${router.query.id}/view`)}>
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
