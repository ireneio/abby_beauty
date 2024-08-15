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
import generateNextTwoWeeks from '@/lib/data/generateNextTwoWeeks'
import generateTimeIntervals from '@/lib/data/generateTimeIntervals'
import type { Metadata } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: '單日預約管理',
}

type Inputs = {
    date: string,
    timeSlots: string[],
}

export default function Page() {
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
        date: '',
        timeSlots: [],
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    
  }

  return (
    <LayoutAdmin>
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
            <Subheading>選擇時段</Subheading>
            <Text>選擇可預約起始時間</Text>
          </div>
          <div>
            <CheckboxGroup>
              {timeOfDayList.map((v) => {
                return (
                  <CheckboxField disabled={!watch('date')} {...register('timeSlots')} key={v.value}>
                    <Checkbox value={v.value} />
                    <Label>{v.label}</Label>
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
          <Button disabled={!watch('date')} type="submit">儲存</Button>
        </div>
      </form>
    </LayoutAdmin>
  )
}
