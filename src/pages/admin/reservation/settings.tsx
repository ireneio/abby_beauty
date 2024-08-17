import { Button } from '@/components/common/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/common/checkbox'
import { Divider } from '@/components/common/divider'
import { Field, Label } from '@/components/common/fieldset'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Text } from '@/components/common/text'
import { Textarea } from '@/components/common/textarea'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import generateTimeIntervals from '@/lib/data/generateTimeIntervals'
import useApi from '@/lib/hooks/useApi'
import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '預約',
  description: '預設值管理',
}

type Inputs = {
  available_days_of_week: string[],
  available_classes: string[]
}

export default function Page() {
  const { api } = useApi()
  const daysOfWeekList = [
    { label: '星期一', value: 'monday' },
    { label: '星期二', value: 'tuesday' },
    { label: '星期三', value: 'wednesday' },
    { label: '星期四', value: 'thursday' },
    { label: '星期五', value: 'friday' },
    { label: '星期六', value: 'saturday' },
    { label: '星期日', value: 'sunday' },
  ]

  const timeOfDayList = generateTimeIntervals()
  const [classes, setClasses] = useState<any[]>([])

  const [availableList, setAvailableList] = useState<{ start: string, end: string }[]>([])

  const isAddAvailableDisabled = useMemo(() => {
    return availableList.length > 0 ?
        availableList[availableList.length - 1].start === '23:45' ||
        availableList[availableList.length - 1].start === '23:30' ||
        availableList[availableList.length - 1].end === '23:45' ||
        availableList[availableList.length - 1].end === '23:30' :
      false
                
  }, [availableList])

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

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      available_days_of_week: [],
      available_classes: [],
    }
  })

  const updateReservationDefault = async (data: any) => {
    const res = await api({
      method: 'POST',
      url: '/admin/reservation/default',
      data,
    })
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    console.log(availableList);
    await updateReservationDefault({
      ...data,
      available_time: availableList,
    })
    await getReservationDefault()
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

  const getReservationDefault = async () => {
    const res = await api({
      method: 'GET',
      url: '/admin/reservation/default'
    })
    if (res.code === 0) {
      setValue('available_days_of_week', res.data.reservation_default_daysofweek.map((v: any) => v.day))
      setAvailableList(res.data.reservation_default_time.reduce((a: any, c: any, i: number) => {
        if (i % 2 === 0) {
          a = [...a, { start: c.time, end: '' }]
        } else {
          a = [...a.slice(0, a.length - 1), { start: a[a.length - 1].start, end: c.time }]
        }
        return a
      }, []))
    } else {
      setValue('available_days_of_week', [])
    }
  }

  useEffect(() => {
    setValue('available_classes', classes.filter((v) => v.available_for_reservation).map((v) => v.id))
  }, [classes])

  useEffect(() => {
    Promise.all([
      getClasses(),
      getReservationDefault()
    ])
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
              {daysOfWeekList.map((v, i) => {
                return (
                  <CheckboxField key={i}>
                    <Checkbox
                      onChange={(checked) => {
                        if (checked) {
                          setValue('available_days_of_week', [...getValues('available_days_of_week'), v.value])
                        } else {
                          setValue('available_days_of_week', getValues('available_days_of_week').filter((value) => value !== v.value))
                        }
                      }}
                      checked={watch('available_days_of_week').includes(v.value)}
                    />
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
            <Subheading>允許預約時段</Subheading>
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

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>允許預約課程</Subheading>
          </div>
          <div>
            <CheckboxGroup>
              {classes.map((v) => {
                return (
                  <CheckboxField key={v.id}>
                    <Checkbox
                      onChange={(checked) => {
                        if (checked) {
                          setValue('available_classes', [...getValues('available_classes'), v.id])
                        } else {
                          setValue('available_classes', getValues('available_classes').filter((value) => value !== v.id))
                        }
                      }}
                      checked={watch('available_classes').includes(v.id)}
                    />
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
          <Button loading={isSubmitting} type="submit">儲存</Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
