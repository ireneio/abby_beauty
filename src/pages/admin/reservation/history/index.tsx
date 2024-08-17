import DialogDeleteConfirm from '@/components/admin/DialogDeleteConfirm'
import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
import { Field, Label } from '@/components/common/fieldset'
import { Heading } from '@/components/common/heading'
import { Input, InputGroup } from '@/components/common/input'
import { Link } from '@/components/common/link'
import { Select } from '@/components/common/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export const metadata: Metadata = {
  title: '預約',
  description: '預約記錄管理',
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('default')
    const sortByList = [
        { label: '按建立日期排序 (從新到舊)', value: 'default' },
    ]
    const [search, setSearch] = useState(() => ({
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
    }))
    const [pagination, setPagination] = useState({
        perPage: 10,
    })
    const tableHeaders = [
        { label: '日期', value: 'date' },
        { label: '課程', value: 'class' },
        { label: 'Email', value: 'email' },
        { label: '電話', value: 'phone' },
        { label: '狀態', value: 'canceled' },
        { label: '操作', value: 'action' },
    ]
    const [tableData, setTableData] = useState<any[]>([])

    const tableDataMapped = useMemo(() => {
        let arr = [...tableData]

        if (router.query.page && !isNaN(Number(router.query.page))) {
            const page = parseInt(Number(router.query.page).toString())
            arr = arr.slice((page - 1) * pagination.perPage, ((page - 1) * pagination.perPage) + pagination.perPage)
        } else {
            arr = arr.slice(0, pagination.perPage)
        }

        // if (search !== '') {
        //     arr = arr.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
        // }

        switch (sortBy) {
            case 'default':
            default:
                arr = arr.sort((a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1)
                break
        }
        return arr
    }, [tableData, search, sortBy, router.query, pagination.perPage])

    const getTableData = async (params: any) => {
        const res = await api({
          method: 'GET',
          url: '/admin/reservation/record',
          params
        })
        if (res.code === 0) {
          setTableData(res.data)
        } else {
          setTableData([])
        }
    }

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteClass = async (id: string) => {
        const res = await api({
        method: 'DELETE',
            url: `/admin/tableData/${id}`,
        })
        return res
    }

    const handleDelete = (id: string) => {
        setDeleteId(id)
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true)
        const res = await deleteClass(deleteId)
        if (res.code === 0 && res.success) {
            // await getTableData()
            setShowDeleteConfirm(false)
        }
        setDeleteLoading(false)
    }
    
    useEffect(() => {
        getTableData({
            startDate: search.startDate,
            endDate: search.endDate,
            page: router.query.page ?? 1,
            perPage: pagination.perPage,
        })
    }, [router.query, pagination, search])

  return (
    <LayoutAdmin>
        <DialogDeleteConfirm
          open={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          confirmLoading={deleteLoading}
        />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>預約記錄管理</Heading>
          <div className="mt-4 flex max-w-xl gap-4 flex-wrap">
            <div className='w-full sm:w-auto'>
                <Field>
                    <Label>起始日期</Label>
                    <InputGroup>
                        <Input
                            type="date"
                            value={search.startDate}
                            onChange={(e) => setSearch((prev) => ({ ...prev, startDate: e.target.value }))}
                        />
                    </InputGroup>
                </Field>
            </div>
            <div className='w-full sm:w-auto'>
                <Field>
                    <Label>結束日期</Label>
                    <InputGroup>
                        <Input
                            type="date"
                            value={search.endDate}
                            onChange={(e) => setSearch((prev) => ({ ...prev, endDate: e.target.value }))}
                        />
                    </InputGroup>
                </Field>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-y-4 mt-4'>
        <div>
            <Button onClick={() => router.push('/admin/reservation/history/creation')}>
                建立
            </Button>
        </div>
        <div className='w-full sm:w-auto sm:ml-auto'>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortByList.map((v) => {
                return (
                    <option key={v.value} value={v.value}>{v.label}</option>
                )
            })}
            </Select>
        </div>
      </div>
      <ul className="mt-4">
        <Table
            dense
            className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
        >
            <TableHead>
                <TableRow>
                    {tableHeaders.map((header) => {
                        return (
                            <TableHeader
                                key={header.value}
                            >
                                {header.label}
                            </TableHeader>
                        )
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {tableData.map((row) => {
                    return (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.date}</TableCell>
                            <TableCell>{row.class_name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>{row.canceled}</TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        
      </ul>
      <div className='mt-4 flex flex-wrap space-y-4 items-center'>
        <div className='w-full sm:w-[120px]'>
            <SelectPerPage
                value={pagination.perPage}
                onChange={(value) => setPagination((prev) => ({ ...prev, perPage: value }))}
            />
        </div>
        <div className='w-full sm:w-auto ml-auto'>
            <Paginator
                    currentPage={router.query.page || 1}
                    total={tableData.length}
                    perPage={pagination.perPage}
            />
        </div>
      </div>
    </LayoutAdmin>
  )
}
