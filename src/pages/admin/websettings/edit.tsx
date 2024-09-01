import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import Swal from 'sweetalert2'
import { Text } from '@/components/common/text'
import { Select } from '@/components/common/select'
import { Textarea } from '@/components/common/textarea'

type Inputs = {
    logo_square: any[];
    logo_rect: any[];
    company_email: string;
    company_phone: string;
    company_address: string;
    company_lineid: string;
    copyright_text: string;
    info_about_us: string;
    info_hint: string;
    website_title: string;
    site_name: string;
    website_description: string;
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const logoSquareUploaderRef = useRef<any>(null)

    const logoRectUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            logo_square: [],
            logo_rect: [],
            company_email: '',
            company_phone: '',
            company_address: '',
            company_lineid: '',
            copyright_text: '',
            info_about_us: '',
            info_hint: '',
            website_title: '',
            website_description: '',
            site_name: '',
        }
    })

    const watchLogoSqaure = watch('logo_square')

    const watchLogoRect = watch('logo_rect')

    const watchWebsiteTitle = watch('website_title')

    const watchWebsiteDescription = watch('website_description')

    const watchSiteName = watch('site_name')

    const watchCopyrightText = watch('copyright_text')

    const watchCompanyLineid = watch('company_lineid')

    const submitDisabled = watchLogoSqaure.length <= 0 ||
        watchLogoRect.length <= 0 ||
        watchWebsiteTitle.length <= 0 ||
        watchWebsiteDescription.length <= 0 ||
        watchSiteName.length <= 0 ||
        watchCompanyLineid.length <= 0

    const update = async (data: any) => {
        let logo_square = ''
        let logo_rect = ''

        if (logoSquareUploaderRef.current) {
            const list = await logoSquareUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                logo_square = list[0].url
            }
        }

        if (logoRectUploaderRef.current) {
            const list = await logoRectUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                logo_rect = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/websettings/1`,
            data: {
                logo_square,
                logo_rect,
                company_email: data.company_email,
                company_phone: data.company_phone,
                company_address: data.company_address,
                company_lineid: data.company_lineid,
                copyright_text: data.copyright_text,
                info_about_us: data.info_about_us,
                info_hint: data.info_hint,
                website_title: data.website_title,
                website_description: data.website_description,
                site_name: data.site_name,
            },
        })
        return res
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        Swal.fire({
            title: '加載中...',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen() {
                Swal.showLoading()
            }
        })

        const res = await update({
          ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/home/websettings`)
            Swal.close()
            Swal.fire({
                title: `更新成功`,
                icon: 'success',
            })
        } else {
            Swal.close()
            Swal.fire({
                title: `錯誤(${res.code})`,
                icon: 'error',
            })
        }
    }

    const getData = async () => {
      const res = await api({
        method: 'GET',
        url: `/admin/websettings/1`,
      })
      return res
    }

    useEffect(() => {
        getData().then((res) => {
            if (res.code === 0 && res.data) {
              const data = res.data
              setValue('company_email', data.company_email)
              setValue('company_phone', data.company_phone)
              setValue('company_address', data.company_address)
              setValue('company_lineid', data.company_lineid)
              setValue('copyright_text', data.copyright_text)
              setValue('info_about_us', data.info_about_us)
              setValue('info_hint', data.info_hint)
              setValue('website_title', data.website_title)
              setValue('website_description', data.website_description)
              setValue('site_name', data.site_name)
              if (logoSquareUploaderRef.current) {
                logoSquareUploaderRef.current.setList([{ url: data.logo_square }])
              }
              setValue('logo_square', [data.logo_square])
              if (logoRectUploaderRef.current) {
                logoRectUploaderRef.current.setList([{ url: data.logo_rect }])
              }
              setValue('logo_rect', [data.logo_rect])
            }
        })
    }, [])

  return (
    <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯網站資料設定</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        Logo (方形)
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於網站內、分享連結等處的方形 Logo</Text>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={logoSquareUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='logo_square'
                        imageSizeRecommended='方形, (如: 500x500)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        Logo (長方形)
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於網站內、分享連結等處的長形 Logo</Text>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={logoRectUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='logo_rect'
                        imageSizeRecommended='橫幅, (如: 1920x1080)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        網站名稱
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於搜尋結果與瀏覽器頁籤的網站名稱</Text>
                </div>
                <div>
                    <Input {...register('site_name')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        網站標題
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於搜尋結果、社群媒體分享、與瀏覽器頁籤的網站名稱</Text>
                </div>
                <div>
                    <Input {...register('website_title')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        網站描述
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於搜尋結果與社群媒體分享的網站描述</Text>
                </div>
                <div>
                    <Input {...register('website_description')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        LINE 官方帳號 ID
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於各處按鈕的 LINE @ 帳號，如「預約諮詢」、「馬上預約體驗」等按鈕</Text>
                </div>
                <div>
                    <Input {...register('company_lineid')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        聯絡 Email
                    </Subheading>
                    <Text>顯示於頁尾的公司 Email</Text>
                </div>
                <div>
                    <Input {...register('company_email')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        聯絡電話
                    </Subheading>
                    <Text>顯示於頁尾的聯絡電話</Text>
                </div>
                <div>
                    <Input {...register('company_phone')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        營業地址
                    </Subheading>
                    <Text>顯示於頁尾的營業地址</Text>
                </div>
                <div>
                    <Input {...register('company_address')} />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
              <Button type="reset" plain onClick={() => router.push(`/admin/home/websettings`)}>
                取消
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
