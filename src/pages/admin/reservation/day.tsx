import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/common/checkbox'
import { Divider } from '@/components/common/divider'
import { Field, Label } from '@/components/common/fieldset'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Text } from '@/components/common/text'
import { Textarea } from '@/components/common/textarea'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import generateNextTwoWeeks from '@/lib/data/generateNextTwoWeeks'
import generateTimeIntervals from '@/lib/data/generateTimeIntervals'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '預約',
  description: '單日預約管理',
}

type Inputs = {
    date: string,
}

export default function Page() {
    const dispatch = useAppDispatch()
    const { api } = useApi()
    const dateList = generateNextTwoWeeks()

    const timeOfDayList = generateTimeIntervals()

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
        date: dayjs().format('YYYY-MM-DD'),
    }
  })

  const [currentList, setCurrentList] = useState<any[]>([])

  const [availableList, setAvailableList] = useState<{ start: string, end: string }[]>([])

  const isAddAvailableDisabled = useMemo(() => {
    if (!watch('date')) {
        return true
    }
    return availableList.length > 0 ?
        availableList[availableList.length - 1].start === '23:45' ||
        availableList[availableList.length - 1].start === '23:30' ||
        availableList[availableList.length - 1].end === '23:45' ||
        availableList[availableList.length - 1].end === '23:30' :
      false
                
  }, [availableList, watch('date')])

  const handleAddAvailableList = () => {
    if (availableList.length > 0) {
      const idx = timeOfDayList.findIndex((v) => v.value === availableList[availableList.length - 1].end)
      const start = timeOfDayList[idx + 1].value
      const end = timeOfDayList[idx + 2].value
      setAvailableList([...availableList, { start, end }])
    } else {
      const start = timeOfDayList[0].value
      const end = timeOfDayList[1].value
      setAvailableList([...availableList, { start, end }])
    }
  }

  const handleRemoveAvailableList = (index: number) => {
    setAvailableList(availableList.filter((v, i) => i !== index))
  }

  const handleUpdateAvailableListStart = (index: number, obj: { start: string, end: string }) => {
    setAvailableList(availableList.map((v, i) => {
      if (i === index) {
        const startIdx = timeOfDayList.findIndex((v) => v.value === obj.start)
        const endIdx = timeOfDayList.findIndex((v) => v.value === obj.end)
        if (startIdx > -1 && endIdx > -1 && endIdx <= startIdx && startIdx < timeOfDayList.length - 1) {
          return { start: obj.start, end: timeOfDayList[startIdx + 1].value }
        }
        return { ...obj, start: obj.start }
      }
      return v
    }))
  }

  const handleUpdateAvailableList = (index: number, obj: { start: string, end: string }) => {
    setAvailableList(availableList.map((v, i) => {
      if (i === index) {
        return obj
      }
      return v
    }))
  }

  const isAvailableListStartDateDisabled = (obj: { label: string, value: string }, index: number) => {
    if (obj.value === '23:45') {
      return true
    }
    let isInvalid = false
    availableList
      .filter((v, i) => i < index)
      .forEach((value) => {
        const criteria1 = dayjs(`2020-01-01 ${obj.value}`).isBefore(dayjs(`2020-01-01 ${value.start}`))
        const criteria2 = dayjs(`2020-01-01 ${obj.value}`).isBefore(dayjs(`2020-01-01 ${value.end}`))
        if (criteria1 || criteria2) {
          isInvalid = true
        }
      })
    return isInvalid
  }

  const isAvailableListEndDateDisabled = (obj: { label: string, value: string }, index: number) => {
    if (isAvailableListStartDateDisabled(obj, index)) {
      return true
    }
    return dayjs(`2020-01-01 ${obj.value}`).isBefore(dayjs(`2020-01-01 ${availableList[index].start}`)) ||
    dayjs(`2020-01-01 ${obj.value}`).isSame(dayjs(`2020-01-01 ${availableList[index].start}`))
  }

  const getData = async (params: any) => {
    const res = await api({
        method: 'GET',
        url: '/admin/reservation/availability',
        params,
    })
    if (res.code === 0) {
        setCurrentList(res.data.map((v: any) => v.time))
    } else {
        setCurrentList([])
    }
  }

  const updateData = async (data: any) => {
    const res = await api({
        method: 'POST',
        url: '/admin/reservation/availability',
        data,
    })
    return res
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const timeList = availableList.reduce((a: string[], c: any) => {
        const startIdx = timeOfDayList.findIndex((v) => v.value === c.start)
        const endIdx = timeOfDayList.findIndex((v) => v.value === c.end)
        const arr = timeOfDayList.slice(startIdx, endIdx + 1).map((v) => v.value)
        a = [...a, ...arr]
        return a
    }, [])

    await updateData({
        time_list: timeList,
        date: data.date,
    })
    await getData({
        date: data.date
    })
    dispatch(openAlert({ title: '儲存成功' }))
  }

  const watchDate = watch('date')

  useEffect(() => {
    if (watchDate) {
        getData({
            date: watchDate,
        })
    }
  }, [watchDate])

  return (
    <LayoutAdmin>
        <NotificationPopup />
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
        <Heading>單日預約管理</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>選擇日期</Subheading>
            <Text>選擇需要調整時段的日期</Text>
          </div>
          <div>
            <Select {...register('date')} aria-label="選擇日期">
              {dateList.map((v) => {
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
            <Subheading>當前允許預約時段</Subheading>
            <Text>當前設定的允許預約的時段</Text>
          </div>
          <div className='flex flex-wrap gap-6'>
            {currentList.map((v) => {
                return (
                    <Badge key={v} className='w-[65px]'>
                        <div className='text-xl'>{v}</div>
                    </Badge>
                )
            })}
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>設定允許預約時段</Subheading>
            <Text>選擇允許預約的時段</Text>
          </div>
          <div>
            <div className='space-y-6'>
              <Button
                disabled={isAddAvailableDisabled}
                onClick={handleAddAvailableList}
              >
                <PlusIcon />
                新增
              </Button>
              <div className='space-y-6'>
                {availableList.map((v, i) => {
                  return (
                    <div key={i} className='flex gap-6 items-end'>
                      <Field className='flex-1'>
                          <Label>起始時間</Label>
                          <Select
                            value={availableList[i].start}
                            onChange={(e) => handleUpdateAvailableListStart(i, {...v, start: e.target.value })}
                            aria-label="起始時間"
                          >
                            {timeOfDayList.map((v) => {
                              return (
                                <option
                                  key={v.value}
                                  value={v.value}
                                  disabled={isAvailableListStartDateDisabled(v, i)}
                                >{v.label}</option>
                              )
                            })}
                          </Select>
                      </Field>
                      <Field className='flex-1'>
                          <Label>結束時間</Label>
                          <Select
                            value={availableList[i].end}
                            onChange={(e) => handleUpdateAvailableList(i, {...v, end: e.target.value })}
                            aria-label="結束時間"                           
                          >
                            {timeOfDayList.map((v) => {
                              return (
                                <option
                                  key={v.value}
                                  value={v.value}
                                  disabled={isAvailableListEndDateDisabled(v, i)}
                                >{v.label}</option>
                              )
                            })}
                          </Select>
                      </Field>
                      <Button color='red' onClick={() => handleRemoveAvailableList(i)}>
                        <MinusIcon />
                        刪除
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
            <Button
                loading={isSubmitting}
                disabled={!watch('date') || !availableList.length}
                type="submit"
            >儲存</Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
