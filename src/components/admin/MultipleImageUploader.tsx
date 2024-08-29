import { ReactSortable } from "react-sortablejs"
import { Input } from "../common/input"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Button } from "../common/button"
import { CloudArrowUpIcon, MinusIcon } from "@heroicons/react/16/solid"
import fileToBase64 from "@/lib/utils/fileToBase64"
import useApi from "@/lib/hooks/useApi"
import { withSwal } from "react-sweetalert2"
import { Text } from "../common/text"
import generateRandomAlphabetString from "@/lib/utils/generateRandomAlphabetString"

type Props = {
    swal: any;
    formKey: string;
    getFormValues: Function;
    setFormValue: Function;
    maxCount: number;
    imageSizeRecommended: string;
    hint?: string;
};

const labelKey = `multiple_image_uploader${generateRandomAlphabetString(10)}`

const MultipleImageUploader = forwardRef((
    { swal, formKey, getFormValues, setFormValue, maxCount, imageSizeRecommended, hint }: Props,
    ref
) => {
    const { api } = useApi()
    const [imagePreviewList, setImagePreviewList] = useState<any[]>([])

    const imageRef = useRef(null)

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

    useImperativeHandle(ref, () => {
        return {
            setList: (list: { url: string }[]) => {
                setFormValue(formKey, list)
                setImagePreviewList(list.map((v: any) => v.url))
            },
            uploadFiles: async (): Promise<{ order: number, url: string }[]> => {
                const res = []
                const list = getFormValues(formKey)
                for (let i = 0; i < list.length; i++) {
                    if (!list[i].id) {
                      const uploadRes = await uploadFile(list[i])
                      res.push({
                        order: i,
                        url: uploadRes.data.url,
                      })
                    } else {
                      res.push({ ...list[i], order: i })
                    }
                }
                return res
            }
        }
    })

    const handleChange = (e: any) => {
        let list: any[] = []
        const image_list: any = getFormValues(formKey)
                
        if (image_list) {
            list = [...image_list, ...e.target.files as any]
        } else {
            list = [...e.target.files as any]
        }

        if (list.length > maxCount) {
            swal.fire({
                icon: 'error',
                title: `最多只能選擇${maxCount}張圖片`
            })
            if (imageRef.current) {
                // @ts-ignore
                imageRef.current.value = ''
            }
        } else {
            setFormValue(formKey, list)
            handleSetImagePreview(e.target.files)
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

    const handleRemoveImagePreview = (index: number) => {
      setImagePreviewList((prev) => {
          return prev.filter((v, i) => i !== index)
      })
      const formItem: any = getFormValues(formKey)
      
      if (formItem) {
        setFormValue(formKey, [...formItem].filter((v, i) => i !== index) as any)
      }
    }

    return (
        <>
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
            <label
                htmlFor={labelKey}
                className="flex items-center justify-center gap-2 border border-zinc-950/10 rounded-md px-8 py-8"
            >
                <CloudArrowUpIcon className="text-zinc-500 w-[36px] h-[36px]" />
                <Text>選擇圖片</Text>
            </label>
            <Input
                id={labelKey}
                className="hidden"
                ref={imageRef}
                type="file"
                multiple={maxCount <= 1 ? false : true}
                accept='image/*'
                aria-label="圖片"
                onClick={() => {
                    if (imageRef.current) {
                        // @ts-ignore
                        imageRef.current.value = ''
                    }
                }}
                onChange={handleChange}
            />
            <div>
                <Text className="text-sm">1. 最多可上傳 {maxCount} 張照片</Text>
                <Text className="text-sm mt-0">2. 圖片格式: jpg, jpeg, png</Text>
                <Text className="text-sm mt-0">3. 建議圖片尺寸大小: {imageSizeRecommended}</Text>
                {hint ? <div className="text-sm text-hint mt-4">*{hint}</div> : null}
            </div>
        </>
    )
})

export default withSwal(MultipleImageUploader)
