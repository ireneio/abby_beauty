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
            url: `/admin/banners/sort`,
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
            Swal.fire({
                title: '更新成功',
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
          url: '/admin/banners',
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
                <title>輪播圖管理</title>
                <meta name="description" content="排序輪播圖" />
            </Head>
            <LayoutAdmin>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-sm:w-full sm:flex-1">
                    <Heading>排序輪播圖</Heading>
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
                                <img
                                    src={row.image_mobile}
                                    className="w-[147px] h-[147px] object-contain rounded-lg shadow-md"
                                />
                                <img
                                    src={row.image_desktop}
                                    className="w-[147px] h-[147px] object-contain rounded-lg shadow-md"
                                />
                            </div>
                        )
                    })}
                </ReactSortable>
            </div>
            <div className="mt-4 flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/home/carousels')}>
                    取消
                </Button>
                <Button loading={submitLoading} onClick={handleSubmit}>儲存</Button>
            </div>
            </LayoutAdmin>
        </>
    )
}
