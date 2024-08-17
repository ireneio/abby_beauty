import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import NotificationPopup from "@/components/global/NotificationPopup";
import { useAppDispatch } from "@/lib/store";
import { openAlert } from "@/lib/store/features/global/globalSlice";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react"

type Inputs = {
  username: string
  password: string
}

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await signIn('credentials', { redirect: false }, {
        username: data.username,
        password: data.password
    })
    if (res && res.ok && res.status === 200) {
      // dispatch(openAlert({ title: '登入成功', showConfirmButton: false }))
      router.push('/admin/classes')
    } else {
      dispatch(openAlert({ title: `錯誤`, content: '帳號或密碼錯誤' }))
    }
  }

  return (
    <>
      <NotificationPopup />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[320px] flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              美容後臺管理
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input {...register("username")} placeholder="帳號" />
                <Input type="password" {...register("password")} placeholder="密碼" />
                <Button loading={isSubmitting} disabled={!watch('username') || !watch('password')} className="w-full" type="submit">登入</Button>
            </form>
          </div>
      </div>
    </>
  )
}
