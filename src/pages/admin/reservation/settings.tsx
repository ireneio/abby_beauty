import { Button } from '@/components/common/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/common/checkbox'
import { Divider } from '@/components/common/divider'
import { Label } from '@/components/common/fieldset'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Text } from '@/components/common/text'
import { Textarea } from '@/components/common/textarea'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import generateTimeIntervals from '@/lib/data/generateTimeIntervals'
import useApi from '@/lib/hooks/useApi'
import type { Metadata } from 'next'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '預設值管理',
}

type Inputs = {
  available_monday: boolean,
  available_tuesday: string,
  available_wednesday: string,
  available_thursday: string,
  available_friday: string,
  available_saturday: string,
  available_sunday: string,
  available_start: string,
  available_end: string,
  available_classes: string[]
}

export default function Page() {
  const { api } = useApi()
  const daysOfWeekList = [
    { label: '星期一', value: 'available_monday' },
    { label: '星期二', value: 'available_tuesday' },
    { label: '星期三', value: 'available_wednesday' },
    { label: '星期四', value: 'available_thursday' },
    { label: '星期五', value: 'available_friday' },
    { label: '星期六', value: 'available_saturday' },
    { label: '星期日', value: 'available_sunday' },
  ]

  const timeOfDayList = generateTimeIntervals()
  const [classes, setClasses] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      available_monday: true,
      available_start: '0800',
      available_end: '1700',
      available_classes: [],
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    
  }

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

  useEffect(() => {
    getClasses()
  }, [])

  return (
    <LayoutAdmin>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
        <Heading>預設值管理</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>允許預約日</Subheading>
          </div>
          <div>
            <CheckboxGroup>
              {daysOfWeekList.map((v) => {
                return (
                  <CheckboxField {...register(v.value as any)} key={v.value}>
                    <Checkbox value={v.value} defaultChecked={true} />
                    <Label>{v.label}</Label>
                  </CheckboxField>
                )
              })}
            </CheckboxGroup>
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>上班時間</Subheading>
            <Text>允許預約的起始時段</Text>
          </div>
          <div>
            <Select {...register('available_start')} aria-label="上班時間">
              {timeOfDayList.map((v) => {
                return (
                  <option key={v.value} value={v.value}>{v.label}</option>
                )
              })}
            </Select>
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>下班時間</Subheading>
            <Text>允許預約的結束時段</Text>
          </div>
          <div>
            <Select {...register('available_end')} aria-label="下班時間">
              {timeOfDayList.map((v) => {
                return (
                  <option key={v.value} value={v.value}>{v.label}</option>
                )
              })}
            </Select>
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>允許預約課程</Subheading>
          </div>
          <div>
            <CheckboxGroup>
              {classes.map((v) => {
                return (
                  <CheckboxField {...register('available_classes')} key={v.id}>
                    <Checkbox value={v.id} />
                    <Label>{v.name}</Label>
                  </CheckboxField>
                )
              })}
            </CheckboxGroup>
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          {/* <Button type="reset" plain>
            Reset
          </Button> */}
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
