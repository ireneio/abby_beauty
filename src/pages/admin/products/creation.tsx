import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Switch, SwitchField } from '@/components/common/switch'
import { Text } from '@/components/common/text'
import WysiwygEditor from '@/components/admin/WysiwygEditor'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import Swal from 'sweetalert2'

type Inputs = {
    name_en: string,
    name_zh: string,
    size: string,
    sku: string,
    usage: string,
    ingredients: string,
    features: string,
    target_users: string,
    product_type_id: number | null,
    hidden: boolean,
    image_list: any,
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const multipleImageUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name_en: '',
            name_zh: '',
            size: '',
            sku: '',
            usage: '',
            ingredients: '',
            features: '',
            target_users: '',
            product_type_id: null,
            hidden: false,
            image_list: null,
        }
    })

    const submitDisabled = !watch('name_zh') || watch('image_list').length <= 0

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/products`,
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
        Swal.fire({
            title: '加載中...',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen() {
                Swal.showLoading()
            }
        })
        let imageUrlArr: { order: number; url: string }[] = []
        
        if (multipleImageUploaderRef.current) {
            const list = await multipleImageUploaderRef.current.uploadFiles()
            imageUrlArr = [...list]
        }

        const res = await create({
            ...data,
            images: imageUrlArr,
        })

        if (res.code === 0) {
            router.replace(`/admin/products/${res.data.id}/view`)
            Swal.close()
            Swal.fire({
                title: `儲存成功`,
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

    const [productTypes, setProductTypes] = useState<any[]>([])

    const getProductTypes = async () => {
        const res = await api({
            method: 'GET',
            url: '/admin/product_types'
        })
        if (res.code === 0) {
            setProductTypes(res.data.productTypes)
        } else {
            setProductTypes([])
        }
    }

    useEffect(() => {
        getProductTypes()
    }, [])

  return (
    <>
        <Head>
            <title>產品管理</title>
            <meta name="description" content="新增產品" />
        </Head>
        <LayoutAdmin>
            <NotificationPopup />
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
                <Heading>新增產品</Heading>
                <Divider className="my-10 mt-6" />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            圖片
                            <RequiredMark />
                        </Subheading>
                    </div>
                    <div className='space-y-4'>
                        <MultipleImageUploader
                            ref={multipleImageUploaderRef}
                            getFormValues={getValues}
                            setFormValue={setValue}
                            formKey='image_list'
                            imageSizeRecommended='方形(如: 500x500)'
                            maxCount={6}
                            hint="可拖曳進行排序，排列順序為第一張的圖片將顯示為該產品的封面圖"
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            中文名稱
                            <RequiredMark />
                        </Subheading>
                    </div>
                    <div>
                        <Input {...register('name_zh')} aria-label="中文名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            英文名稱
                        </Subheading>
                    </div>
                    <div>
                        <Input {...register('name_en')} aria-label="英文名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>
                            系列
                        </Subheading>
                        <Text>選擇產品系列</Text>
                    </div>
                    <div>
                        <Select
                            {...register('product_type_id')}
                            aria-label="選擇系列"
                        >
                            <option value="">選擇系列</option>
                            {productTypes.map((v) => {
                                return (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                )
                            })}
                        </Select>
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>規格</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('size')}
                            onChange={(value) => setValue('size', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                    <Subheading>產品特點</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('features')}
                            onChange={(value) => setValue('features', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                    <Subheading>成份內容</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('ingredients')}
                            onChange={(value) => setValue('ingredients', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                {/* <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                    <Subheading>適用對象</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('target_users')}
                            onChange={(value) => setValue('target_users', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft /> */}

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                    <Subheading>使用方法</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('usage')}
                            onChange={(value) => setValue('usage', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>上架狀態</Subheading>
                        <Text>設定是否上架於前台</Text>
                    </div>
                    <div>
                        <SwitchField>
                            <Switch
                                onChange={(checked) => {
                                    setValue('hidden', !checked)
                                }}
                                checked={watch('hidden') === false}
                            />
                        </SwitchField>
                    </div>
                </section>

                <Divider className="my-10" soft />

                <div className="flex justify-end gap-4">
                <Button type="reset" plain href="/admin/products">
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
    </>
  )
}
