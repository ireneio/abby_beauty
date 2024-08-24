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
import Tiptap from '@/components/common/Tiptap'
import WysiwygEditor from '@/components/common/WysiwygEditor'
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
  title: '體驗課程',
  description: '編輯體驗課程',
}

type Inputs = {
    title: string,
    title_short: string,
    subtitle: string,
    content: string,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()

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
            subtitle: '',
            content: '',
        }
    })

    const submitDisabled = !watch('title')

    const update = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/trials/${router.query.id}`,
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
        const res = await update({
            ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/trials/${router.query.id}/view`)
        } else {
            dispatch(openAlert({ title: `錯誤(${res.code})` }))
        }
    }

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/trials/${router.query.id}`,
      })
      return res
    }

    useEffect(() => {
      if (router.query.id) {
        getData().then((res) => {
          if (res.code === 0 && res.data) {
            const data = res.data
            setValue('title', data.title)
            setValue('title_short', data.title_short)
            setValue('subtitle', data.subtitle)
            setValue('content', data.content)
          }
        })
      }
    }, [router.query.id])

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯體驗課程</Heading>
            <Divider className="my-10 mt-6" />

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
                        <RequiredMark />
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
                        <RequiredMark />
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
              <Button type="reset" plain onClick={() => router.push(`/admin/trials`)}>
                返回列表
              </Button>
              <Button type="reset" plain onClick={() => router.push(`/admin/trials/${router.query.id}/view`)}>
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
