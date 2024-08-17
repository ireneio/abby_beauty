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
import generateTimeIntervals from '@/lib/data/generateTimeIntervals'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import fileToBase64 from '@/lib/utils/fileToBase64'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '預約',
  description: '新增預約記錄',
}

type Inputs = {
    name: string,
    email: string,
    phone: string,
    memo: string,
    class_id: number,
    date: string,
    time: string,
    assignee_id: number,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()

    const timeOfDayList = generateTimeIntervals()

    const [classes, setClasses] = useState<any[]>([])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            memo: '',
            date: '',
            time: '',
        }
    })

    const getClasses = async () => {
        const res = await api({
          method: 'GET',
          url: '/admin/classes'
        })
        if (res.code === 0) {
          setClasses(res.data)
        } else {
          setClasses([])
        }
    }

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/reservation/record`,
            data,
        })
        return res
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        
    }

    useEffect(() => {
        getClasses()
    }, [])

    return (
        <LayoutAdmin>
            <NotificationPopup />
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
                <Heading>新增預約記錄</Heading>
                <Divider className="my-10 mt-6" />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            姓名
                            <RequiredMark />
                        </Subheading>
                    </div>
                    <div>
                        <Input {...register('name')} aria-label="名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            Email
                            <RequiredMark />
                        </Subheading>
                    </div>
                    <div>
                        <Input type="email" {...register('email')} aria-label="名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            聯絡電話
                            <RequiredMark />
                        </Subheading>
                    </div>
                    <div>
                        <Input {...register('phone')} aria-label="名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>備註</Subheading>
                    </div>
                    <div>
                        <Textarea {...register('memo')} aria-label="描述" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            課程
                            <RequiredMark />
                        </Subheading>
                        <Text>選擇課程</Text>
                    </div>
                    <div>
                        <Select {...register('class_id')} aria-label="選擇課程">
                            <option value="">選擇課程</option>
                            {classes.map((v) => {
                                return (
                                    <option key={v.id} value={v.id}>{`${v.name}(${v.minutes}分鐘)`}</option>
                                )
                            })}
                        </Select>
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            日期
                            <RequiredMark />
                        </Subheading>
                        <Text>選擇日期</Text>
                    </div>
                    <div>
                        <Input type="date" {...register('date')} aria-label="日期" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            時段
                            <RequiredMark />
                        </Subheading>
                        <Text>選擇時段</Text>
                    </div>
                    <div>
                        <Select {...register('time')} aria-label="選擇時段">
                            <option value="">選擇時段</option>
                            {timeOfDayList.map((v) => {
                                return (
                                    <option key={v.value} value={v.value}>{v.label}</option>
                                )
                            })}
                        </Select>
                    </div>
                </section>

                <Divider className="my-10" soft />

                <div className="flex justify-end gap-4">
                    <Button type="reset" plain onClick={() => router.push('/admin/reservation/history')}>
                        返回列表
                    </Button>
                    <Button
                        loading={isSubmitting}
                        disabled={!watch('name') ||
                            !watch('email') ||
                            !watch('phone') ||
                            !watch('class_id') ||
                            !watch('date') ||
                            !watch('time') 
                        }
                        type="submit"
                    >
                        儲存
                    </Button>
                </div>
            </form>
        </LayoutAdmin>
    )
}
