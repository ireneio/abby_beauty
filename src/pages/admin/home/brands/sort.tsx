import { Button } from "@/components/common/button";
import { Heading, Subheading } from "@/components/common/heading";
import { Text } from "@/components/common/text";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import useApi from "@/lib/hooks/useApi";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [tableData, setTableData] = useState<any[]>([])
    const [submitLoading, setSubmitLoading] = useState(false)

    const update = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/brands/sort`,
            data,
        })
        return res
    }

    const handleSubmit = async () => {
        Swal.fire({
            title: '加載中...',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen() {
                Swal.showLoading()
            }
        })

        const res = await update({
            items: tableData.map((row, i) => {
                return {
                    id: row.id,
                    order: i
                }
            })
        })
        Swal.close()
        if (res.code === 0) {
            router.push('/admin/home/brands')
            Swal.fire({
                title: '儲存成功',
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: '更新失敗',
                icon: 'error'
            })
        }
    }

    const getTableData = async (params?: any) => {
        const res = await api({
          method: 'GET',
          url: '/admin/brands',
          params,
        })
        if (res.code === 0) {
          setTableData(res.data.rows)
        } else {
          setTableData([])
        }
      }

      useEffect(() => {
        getTableData({
            sortBy: 'order',
            sortDirection: 'asc',
        })
      }, [])

    return (
        <>
            <Head>
                <title>品牌價值管理</title>
                <meta name="description" content="排序品牌價值" />
            </Head>
            <LayoutAdmin>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-sm:w-full sm:flex-1">
                    <Heading>排序品牌價值</Heading>
                    <Text>拖曳以調整排序</Text>
                </div>
            </div>
            <div className="mt-4">
                <ReactSortable list={tableData} setList={setTableData} swap>
                    {tableData.map((row) => {
                        return (
                            <div
                                key={row.id}
                                className="px-4 py-4 border border-[#ccc] mb-4 flex gap-4"
                            >
                                <img src={row.image} alt="" className="object-contain rounded-lg w-[147px] aspect-[1/1]" />
                                <div>{row.title}</div>
                            </div>
                        )
                    })}
                </ReactSortable>
            </div>
            <div className="mt-4 flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/home/brands')}>
                    取消
                </Button>
                <Button loading={submitLoading} onClick={handleSubmit}>儲存</Button>
            </div>
            </LayoutAdmin>
        </>
    )
}
