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
  title: '產品',
  description: '新增產品',
}

type Inputs = {
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
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { api } = useApi()

    const [imagePreviewList, setImagePreviewList] = useState<any[]>([])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
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

    const submitDisabled = !watch('name_zh') || !imagePreviewList.length

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
        const imageUrlArr = []
        
        if (data.image_list) {
            for (let i = 0; i < data.image_list.length; i++) {
              if (!data.image_list[i].id) {
                const uploadRes = await uploadFile(data.image_list[i])
                imageUrlArr.push({ order: i, url: uploadRes.data.url })
              } else {
                imageUrlArr.push({ ...data.image_list[i], order: i })
              }
            }
        }

        const res = await create({
            ...data,
            images: imageUrlArr,
        })

        if (res.code === 0) {
            router.replace(`/admin/products/${res.data.id}/view`)
        } else {
            dispatch(openAlert({ title: `錯誤(${res.code})` }))
        }
    }

    const imageRef = useRef(null)

    const handleRemoveImagePreview = (index: number) => {
        setImagePreviewList((prev) => {
            return prev.filter((v, i) => i !== index)
        })
        const formItem: any = getValues('image_list')
        if (formItem) {
            setValue('image_list', [...formItem].filter((v, i) => i !== index) as any)
        }
    }

    const handleSetImagePreview = async (files: FileList | null) => {
        if (files) {
            let arr: string[] = [...imagePreviewList]
            for (let i = 0; i < files.length; i++) {
                const base64 = await fileToBase64(files[i])
                arr = [...arr, `data:image/png;base64,${base64}`]
            }
            setImagePreviewList(arr)
        } else {
            setImagePreviewList([])
        }
    }

    const [productTypes, setProductTypes] = useState<any[]>([])

    const getProductTypes = async () => {
        const res = await api({
            method: 'GET',
            url: '/admin/product_types'
        })
        if (res.code === 0) {
            setProductTypes(res.data)
        } else {
            setProductTypes([])
        }
    }

    useEffect(() => {
        getProductTypes()
    }, [])

  return (
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
                    <ReactSortable className='flex flex-wrap gap-4' list={imagePreviewList} setList={setImagePreviewList}>
                        {imagePreviewList.map((item, i) => (
                            <div key={i} className='relative w-[148px]'>
                                <div className='absolute top-2 left-2' onClick={() => handleRemoveImagePreview(i)}>
                                    <Button className='w-[2rem] h-[2rem]'>
                                        <MinusIcon />
                                    </Button>
                                </div>
                                <img key={i} className="aspect-[1/1] rounded-lg shadow w-full object-contain" src={item} alt="" />
                            </div>
                        ))}
                    </ReactSortable>
                    <Input
                        ref={imageRef}
                        type="file"
                        multiple
                        accept='image/*'
                        aria-label="圖片"
                        onClick={() => {
                            if (imageRef.current) {
                                // @ts-ignore
                                imageRef.current.value = ''
                            }
                        }}
                        onChange={(e) => {                            
                            const image_list: any = getValues('image_list')                            
                            if (image_list) {
                              setValue('image_list', [...image_list, ...e.target.files as any] as any)
                            } else {
                              setValue('image_list', [...e.target.files as any] as any)
                            }
                            handleSetImagePreview(e.target.files)
                        }}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        名稱
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('name_zh')} aria-label="名稱" />
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
                    <Subheading>容量</Subheading>
                </div>
                <div>
                    <Input {...register('size')} aria-label="容量" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>產品特點</Subheading>
                </div>
                <div>
                    <Tiptap setValue={setValue} name="features" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>成份內容</Subheading>
                </div>
                <div>
                    <Tiptap setValue={setValue} name="ingredients" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>適用對象</Subheading>
                </div>
                <div>
                    <Tiptap setValue={setValue} name="target_users" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                <Subheading>使用方法</Subheading>
                </div>
                <div>
                    <Tiptap setValue={setValue} name="usage" />
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
            <Button type="reset" plain>
                <Link href="/admin/products">
                    返回列表
                </Link>
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
