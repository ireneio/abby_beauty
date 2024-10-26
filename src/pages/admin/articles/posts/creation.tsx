import RequiredMark from '@/components/admin/RequiredMark'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Heading, Subheading } from '@/components/common/heading'
import { Input } from '@/components/common/input'
import NotificationPopup from '@/components/global/NotificationPopup'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useMemo, useRef, useState } from 'react'
import Swal from 'sweetalert2'
// import MultipleImageUploader from '@/components/admin/MultipleImageUploader'
import dayjs from 'dayjs'
import WysiwygEditor from '@/components/admin/WysiwygEditor'
import { Text } from '@/components/common/text'
import { ReactTags, Tag } from 'react-tag-autocomplete'
import MultipleImageUploader from '@/components/admin/MultipleImageUploader'

type Inputs = {
    cover: any[];
    title: string;
    subtitle: string;
    content: string;
    publish_date: string;
    start_date: string;
    end_date: string;
    tag_ids: number[];
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
            cover: [],
            title: '',
            subtitle: '',
            content: '',
            publish_date: dayjs().format('YYYY-MM-DD'),
            start_date: '',
            end_date: '',
            tag_ids: [],
        }
    })

    const watchTitle = watch('title')

    const watchPublishDate = watch('publish_date')

    const watchTagIds = watch('tag_ids')

    const submitDisabled = watchTitle.length <= 0 ||
        watchPublishDate.length <= 0 || watchTagIds.length <= 0

    const create = async (data: any) => {
        let cover = ''

        if (imageUploaderRef.current) {
            const list = await imageUploaderRef.current.uploadFiles()
            if (list.length > 0) {
                cover = list[0].url
            }
        }

        const res = await api({
            method: 'POST',
            url: `/admin/articles`,
            data: {
                cover,
                title: data.title,
                subtitle: data.subtitle,
                content: data.content,
                publish_date: data.publish_date,
                start_date: data.start_date,
                end_date: data.end_date,
                tag_ids: data.tag_ids,
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

        const res = await create({
            ...data,
        })

        if (res.code === 0) {
            router.replace(`/admin/articles/posts/${res.data.id}/view`)
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

    const [tagsList, setTagsList] = useState<any[]>([])

    const getTags = async () => {
        const res = await api({
            method: 'GET',
            url: '/admin/article_tags'
        })
        if (res.code === 0) {
            setTagsList(res.data.rows)
        } else {
            setTagsList([])
        }
    }

    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

    useEffect(() => {        
        getTags()
    }, [])

  return (
    <LayoutAdmin>
        <NotificationPopup />
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl">
            <Heading>新增文章</Heading>
            <Divider className="my-10 mt-6" />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        封面圖
                    </Subheading>
                </div>
                <div>
                    <MultipleImageUploader
                        ref={imageUploaderRef}
                        getFormValues={getValues}
                        setFormValue={setValue}
                        formKey='cover'
                        imageSizeRecommended='直幅, 橫福, 或方形皆可 (如: 500x500, 1920x1080, 900x1600)'
                        maxCount={1}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        顯示的日期
                        <RequiredMark />
                    </Subheading>
                    <Text>顯示於文章內的發佈日期</Text>
                </div>
                <div>
                    <Input type='date' {...register('publish_date')} aria-label="顯示的日期" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        標題
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <Input {...register('title')} aria-label="標題" />
                    <div className='flex justify-between'>
                        <Text>建議不超過 50 字</Text>
                        <Text>字數: {watch('title').length}</Text>
                    </div>
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        預覽內容
                    </Subheading>
                </div>
                <div>
                    <Input {...register('subtitle')} aria-label="預覽內容" />
                    <div className='flex justify-between'>
                        <Text>建議不超過 150 字</Text>
                        <Text>字數: {watch('subtitle').length}</Text>
                    </div>
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        內容
                    </Subheading>
                </div>
                <div>
                    <WysiwygEditor
                        value={watch('content')}
                        onChange={(value) => setValue('content', value)}
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        起始日期
                    </Subheading>
                    <Text>文章發佈的起始日期</Text>
                    <Text>若不選擇將永久顯示</Text>
                </div>
                <div>
                    <Input type='date' {...register('start_date')} aria-label="起始日期" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        結束日期
                    </Subheading>
                    <Text>文章發佈的結束日期</Text>
                    <Text>若不選擇將永久顯示</Text>
                </div>
                <div>
                    <Input type='date' {...register('end_date')} aria-label="結束日期" />
                </div>
            </section>

            <Divider className="my-10" soft />

            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <Subheading>
                        分類
                        <RequiredMark />
                    </Subheading>
                </div>
                <div>
                    <ReactTags
                        labelText="選擇分類"
                        selected={selectedTags}
                        suggestions={tagsList.map((tag) => ({ label: tag.name, value: tag.id }))}
                        onAdd={(newTag) => {
                            setSelectedTags((prev) => {
                                return [...prev, newTag]
                            })
                            setValue('tag_ids', [...watch('tag_ids'), newTag.value as number])
                        }}
                        onDelete={(index) => {
                            setSelectedTags((prev) => {
                                return prev.filter((v, i) => i !== index)
                            })
                            setValue('tag_ids', getValues('tag_ids').filter((v, i) => i !== index))
                        }}
                        noOptionsText="無符合的分類"
                        placeholderText="搜尋分類"
                    />
                </div>
            </section>

            <Divider className="my-10" soft />

            <div className="flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/articles/posts')}>
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
