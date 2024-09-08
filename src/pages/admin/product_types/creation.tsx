import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import WysiwygEditor from '@/components/admin/WysiwygEditor'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'

type Inputs = {
    name: string,
    description: string,
    image_list: any,
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

    const imageUploaderRef = useRef<any>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            description: '',
            image_list: null,
        }
    })

    const submitDisabled = !watch('name')

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/product_types`,
            data,
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
        
        if (imageUploaderRef.current) {
            const list = await imageUploaderRef.current.uploadFiles()
            imageUrlArr = [...list]
        }

        const res = await create({
            ...data,
            image_cover: imageUrlArr.length > 0 ? imageUrlArr[0].url : '',
        })

        if (res.code === 0) {
            router.replace(`/admin/product_types/${res.data.id}/view`)
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

  return (
    <>
        <Head>
            <title>產品系列管理</title>
            <meta name="description" content="新增產品系列" />
        </Head>
        <LayoutAdmin>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
                <Heading>新增產品系列</Heading>
                <Divider className="my-10 mt-6" />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Subheading>封面圖</Subheading>
                    </div>
                    <div className='space-y-4'>
                        <MultipleImageUploader
                            ref={imageUploaderRef}
                            getFormValues={getValues}
                            setFormValue={setValue}
                            formKey='image_list'
                            imageSizeRecommended='直幅 (如: 900x1600)'
                            maxCount={1}
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
                        <Input {...register('name')} aria-label="名稱" />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                    <Subheading>系列介紹</Subheading>
                    </div>
                    <div>
                        <WysiwygEditor
                            value={watch('description')}
                            onChange={(value) => setValue('description', value)}
                        />
                    </div>
                </section>

                <Divider className="my-10" soft />

                <div className="flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/product_types')}>
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
