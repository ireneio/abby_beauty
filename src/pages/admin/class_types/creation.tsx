import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

type Inputs = {
    name: string,
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()

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
        }
    })

    const submitDisabled = !watch('name')

    const create = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/class_types`,
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

        const res = await create({
            ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/class_types/${res.data.id}/view`)
            Swal.close()
            Swal.fire({
                title: `新增成功`,
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
    <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增課程系列</Heading>
            <Divider className="my-10 mt-6" />

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

            <div className="flex justify-end gap-4">
            <Button type="reset" plain onClick={() => router.push('/admin/products')}>
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
