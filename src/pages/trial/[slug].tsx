// import RequiredMark from "@/components/admin/RequiredMark";
import Breadcrumb from "@/components/client/Breadcrumb";
import { Button } from "@/components/client/Button";
import QuillContentWrapper from "@/components/client/QuillContentWrapper";
import CarouselTrialImage from "@/components/client/trial/CarouselTrialImage";
// import { Checkbox, CheckboxField, CheckboxGroup } from "@/components/common/checkbox";
// import { Field, Label } from "@/components/common/fieldset";
// import { Input } from "@/components/common/input";
// import { Select } from "@/components/common/select";
import { RootLayout } from "@/components/layout/RootLayout";
import { api } from "@/lib/api/connector";
import seoDefault from "@/lib/data/seoDefault";
import { defaultInstance } from "@/lib/hooks/useApi";
import formatNumberToMoney from "@/lib/utils/formatNumberToMoney";
import openLineAtAccount from "@/lib/utils/openLineAtAccount";
// import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
// import Image from "next/image";
import { useRouter } from "next/router";
// import { useForm } from "react-hook-form";
import { withSwal } from 'react-sweetalert2';

// type FormInputs = {
//     name: string
//     email: string
//     phone: string
//     line_id: string
//     date: string
//     time_of_day: string
//     know_us_list: string[]
// }

export const getStaticPaths: GetStaticPaths = async () => {
    const getAllTrials = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: '/client/trials',
        })
        if (res.code === 0) {
            return res.data
        }
        return []
    }

    const list = await getAllTrials()

    const paths = list.map((trial: { slug: string }) => ({
        params: { slug: trial.slug },
    }));

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params!; // 'id' is the dynamic parameter
  
    const getData = async () => {
        const res = await api(defaultInstance, {
            method: 'GET',
            url: `/client/trials/${slug}`,
        })
        if (res.code === 0) {
            return res.data
        }
        return {
            id: '',
            title_short: '',
            title: '',
            slug: '',
            subtitle: '',
            content: '',
            images: [],
            price_discount: '',
            price_original: '',
        }
    }
    const data = await getData()
    const props = {
        data,
    }
  
    return {
      props,
      revalidate: 10,
    };
};

type Props = any

function Page({ swal, data }: Props) {
    const router = useRouter()

    // const timeOfDayOptions = [
    //     { label: '上午 (10:00-12:00)', value: '上午 (10:00-12:00)' },
    //     { label: '下午 (12:00-17:00)', value: '下午 (12:00-17:00)' },
    //     { label: '晚間 (17:00-20:00)', value: '晚間 (17:00-20:00)' },
    // ]

    // const knowUsOptions = [
    //     { label: 'Google廣告', value: 'Google廣告' },
    //     { label: 'Instagram', value: 'Instagram' },
    //     { label: 'LINE', value: 'LINE' },
    //     { label: '親友分享連結點擊進入', value: '親友分享連結點擊進入' },
    // ]

    // const form = useForm<FormInputs>({
    //     defaultValues: {
    //         name: '',
    //         email: '',
    //         phone: '',
    //         line_id: '',
    //         date: '',
    //         time_of_day: '',
    //         know_us_list: [],
    //     }
    // })

    // const createTrialReservation = async (data: any) => {
    //     const res = await api({
    //         method: 'POST',
    //         url: '/client/trial_reservations',
    //         data
    //     })
    //     if (res.code === 0) {
    //         swal.fire({
    //             title: '成功',
    //             text: '您的體驗預約申請已送出，請靜待專員電話聯繫！',
    //             icon: 'success',
    //         })
    //         form.resetField('name')
    //         form.resetField('email')
    //         form.resetField('phone')
    //         form.resetField('line_id')
    //         form.resetField('date')
    //         form.resetField('time_of_day')
    //         form.resetField('know_us_list')
    //         form.setValue('know_us_list', [])
    //     } else {
    //         swal.fire({
    //             title: `失敗 (${res.code})`,
    //             text: '請稍後再試',
    //             icon: 'error',
    //         })
    //     }
    // }

    // const onSubmit = async (formData: any) => {
    //     await createTrialReservation({
    //         ...formData,
    //         trial_name: data.title_short,
    //     })
    // }

    return (
        <>
            <Head>
                <title>{data.title_short}</title>
                <meta name="description" content={data.title} />
                <meta property="og:title" content={data.title_short} />
                <meta property="og:description" content={data.title} />
                <meta property="og:image" content={seoDefault.image} />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/trial/${router.query.slug}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={seoDefault.site_name} />
                <meta property="twitter:card" content={seoDefault.image} />
                <meta name="twitter:title" content={data.title_short} />
                <meta name="twitter:description" content={data.title} />
                <meta property="twitter:image" content={seoDefault.image} />
                {/* <meta name="twitter:site" content="@yourtwitterhandle" />
                <meta name="twitter:creator" content="@creatorhandle" /> */}
            </Head>
            <RootLayout>
                <div className="max-w-7xl mx-auto">
                    <div className="px-4">
                        <Breadcrumb
                            list={[
                                { text: '首頁', url: '/' },
                                { text: '預約體驗課程' },
                                { text: data.title_short },
                            ]}
                        />
                    </div>
                    <div className="md:grid md:grid-cols-4 md:gap-x-8 mt-4">
                        <div className="px-4 md:pr-0 md:col-span-2">
                            <CarouselTrialImage images={data.images} />
                        </div>
                        <section className="mt-4 md:pr-4 md:mt-0 md:col-span-2">
                            <h2 className="text-highlight text-lg bg-primary px-4 py-4 font-semibold">{data.title}</h2>
                            <div>
                                {data.subtitle ? <div className="px-4 mt-4 text-sm font-light text-secondary">{data.subtitle}</div> : null}
                                <div className="mt-4 h-[1px] w-full bg-[#ccc]"></div>
                                <div className="mt-4 px-4">
                                    <div>體驗價</div>
                                    <div className="mt-2 flex gap-2 items-end">
                                        <div className="text-danger text-3xl">NT${formatNumberToMoney(data.price_discount)}</div>
                                        <div className="line-through text-gray-400">NT${formatNumberToMoney(data.price_original)}</div>
                                    </div>
                                </div>
                                <div className="px-4 mt-8">
                                    <div>課程內容</div>
                                    <div className="mt-2">
                                        <QuillContentWrapper content={data.content} />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-center md:justify-start md:px-4">
                                    <Button onClick={() => openLineAtAccount()}>馬上預約體驗</Button>
                                </div>
                                {/* <div className="px-4 mt-8 max-w-[500px] mx-auto">
                                    <div className="text-md bg-primary text-secondary text-center px-4 py-4">馬上預約體驗</div>
                                    <Field className="mt-4">
                                        <Label>
                                            姓名
                                            <RequiredMark />
                                        </Label>
                                        <Input {...form.register('name', { required: true })} />
                                        {form.formState.errors.name ? <span className="text-danger text-xs">請輸入姓名</span> : null}
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            Email
                                            <RequiredMark />
                                        </Label>
                                        <Input type="email" {...form.register('email', { required: true })} />
                                        {form.formState.errors.email ? <span className="text-danger text-xs">請輸入正確格式的 Email</span> : null}
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            聯絡電話
                                            <RequiredMark />
                                        </Label>
                                        <Input type="tel" {...form.register('phone', { required: true })} />
                                        {form.formState.errors.name ? <span className="text-danger text-xs">請輸入聯絡電話</span> : null}
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            LINE ID
                                        </Label>
                                        <Input {...form.register('line_id')} />
                                        <div className="mt-1 font-light text-sm">以利我們即時與您聯繫。</div>
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            您想預約的日期
                                            <RequiredMark />
                                        </Label>
                                        <Input min={dayjs().format('YYYY-MM-DD')} type="date" {...form.register('date', { required: true })} />
                                        {form.formState.errors.date ? <span className="text-danger text-xs">請選擇您想預約的日期</span> : null}
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            方便我們連繫您的時段
                                            <RequiredMark />
                                        </Label>
                                        <Select {...form.register('time_of_day', { required: true })}>
                                            {timeOfDayOptions.map((time, i) => {
                                                return (
                                                    <option key={i} value={time.value}>{time.label}</option>
                                                )
                                            })}
                                        </Select>
                                        {form.formState.errors.time_of_day ? <span className="text-danger text-xs">請選擇方便我們連繫您的時段</span> : null}
                                    </Field>
                                    <Field className="mt-4">
                                        <Label>
                                            您是從哪裡得知我們的網頁呢?
                                        </Label>
                                        <CheckboxGroup>
                                            {knowUsOptions.map((v, i) => {
                                                return (
                                                <CheckboxField key={i}>
                                                    <Checkbox
                                                        onChange={(checked) => {
                                                            if (checked) {
                                                                form.setValue('know_us_list', [...form.getValues('know_us_list'), v.value])
                                                            } else {
                                                                form.setValue('know_us_list', form.getValues('know_us_list').filter((value: any) => value !== v.value))
                                                            }
                                                        }}
                                                        checked={form.watch('know_us_list').includes(v.value)}
                                                    />
                                                    <Label>{v.label}</Label>
                                                </CheckboxField>
                                                )
                                            })}
                                            </CheckboxGroup>
                                    </Field>
                                    <div className="mt-8 flex justify-center">
                                        <Button
                                            loading={form.formState.isSubmitting}
                                            onClick={form.handleSubmit(onSubmit)}
                                        >立即預約</Button>
                                    </div>
                                    <div className="mt-8">
                                        <div className="text-md text-center text-secondary">
                                            表單送出後不代表預約成功，<br />
                                            我們將於2~3個工作天內<br />
                                            電話與您聯繫確認！感謝您！
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </section>
                    </div>
                </div>
            </RootLayout>
        </>
    )
}

export default withSwal(Page)