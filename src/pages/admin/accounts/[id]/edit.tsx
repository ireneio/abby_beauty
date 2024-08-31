import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import WysiwygEditor from '@/components/admin/WysiwygEditor'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useAppDispatch } from '@/lib/store'
import { openAlert } from '@/lib/store/features/global/globalSlice'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import { Text } from '@/components/common/text'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user as any
    const permission = user?.permission ?? []
  
    if (!session || !user || !permission.includes("root")) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        user: session.user,
      },
    };
  };

type Inputs = {
    username: string;
    password: string;
}

export default function Page() {
    const dispatch = useAppDispatch()
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
            username: '',
            password: '',
        }
    })

    const submitDisabled = !watch('password')

    const update = async (data: any) => {
        const res = await api({
            method: 'POST',
            url: `/admin/accounts/${router.query.id}`,
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

        const res = await update({
            password: data.password,
        })

        if (res.code === 0) {
            router.replace(`/admin/accounts/${router.query.id}/view`)
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
        url: `/admin/accounts/${router.query.id}`,
      })
      return res
    }

    useEffect(() => {
      if (router.query.id) {
        getData().then((res) => {
          if (res.code === 0 && res.data) {
            const data = res.data
            setValue('username', data.username)
          }
        })
      }
    }, [router.query.id])

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>編輯後台帳號</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        帳號
                    </Subheading>
                </div>
                <div>
                    <Text>{watch('username')}</Text>
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        密碼
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input type="password" {...register('password')} aria-label="密碼" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
              <Button type="reset" plain onClick={() => router.push(`/admin/accounts`)}>
                取消
              </Button>
              <Button type="reset" plain onClick={() => router.push(`/admin/accounts/${router.query.id}/view`)}>
                查看
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
