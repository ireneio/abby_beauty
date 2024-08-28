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

import WysiwygEditor from '@/components/admin/WysiwygEditor'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import fileToBase64 from '@/lib/utils/fileToBase64'
import generateRandomAlphabetString from '@/lib/utils/generateRandomAlphabetString'
import { MinusIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ReactSortable } from "react-sortablejs";

export const metadata: Metadata = {
  title: '體驗課程',
  description: '新增體驗課程',
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
        const res = await create({
            ...data,
            slug: generateRandomAlphabetString(5),
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
