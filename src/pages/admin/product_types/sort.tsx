import { Button } from "@/components/common/button";
import { Heading, Subheading } from "@/components/common/heading";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import useApi from "@/lib/hooks/useApi";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2";

function Page({ swal }: any) {
    const router = useRouter()
    const { api } = useApi()
    const [tableData, setTableData] = useState<any[]>([])
    const [submitLoading, setSubmitLoading] = useState(false)

    const update = async (data: any) => {    
        const res = await api({
            method: 'POST',
            url: `/admin/product_types/sort`,
            data,
        })
        return res
    }

    const handleSubmit = async () => {
        setSubmitLoading(true)
        const res = await update({
            items: tableData.map((row, i) => {
                return {
                    id: row.id,
                    order: i
                }
            })
        })
        if (res.code === 0) {
            swal.fire({
                title: '更新成功',
                icon: 'success'
            })
        } else {
            swal.fire({
                title: '更新失敗',
                icon: 'error'
            })
        }
        setSubmitLoading(false)
    }

    const getTableData = async (params?: any) => {
        const res = await api({
          method: 'GET',
          url: '/admin/product_types',
          params,
        })
        if (res.code === 0) {
          setTableData(res.data.productTypes)
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
                <title>產品系列管理</title>
                <meta name="description" content="排序產品系列" />
            </Head>
            <LayoutAdmin>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-sm:w-full sm:flex-1">
                    <Heading>排序產品系列</Heading>
                    <Subheading>拖曳以調整排序</Subheading>
                </div>
            </div>
            <div className="mt-4">
                <ReactSortable list={tableData} setList={setTableData} swap>
                    {tableData.map((row) => {
                        return (
                            <div
                                key={row.id}
                                className="px-4 py-4 border border-[#ccc] mb-4"
                            >
                                {row.name}
                            </div>
                        )
                    })}
                </ReactSortable>
            </div>
            <div className="mt-4 flex justify-end gap-4">
                <Button type="reset" plain onClick={() => router.push('/admin/product_types')}>
                    返回列表
                </Button>
                <Button loading={submitLoading} onClick={handleSubmit}>儲存</Button>
            </div>
            </LayoutAdmin>
        </>
    )
}

export default withSwal(Page)