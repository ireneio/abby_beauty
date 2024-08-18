import DialogDeleteConfirm from '@/components/admin/DialogDeleteConfirm'
import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
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
  title: '課程系列',
  description: '課程系列管理',
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('default')
    const sortByList = [
        { label: '按建立日期排序 (從新到舊)', value: 'default' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
        perPage: 10,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const tableHeaders = [
        { label: '名稱', value: 'name_zh' },
        { label: '操作', value: 'action' },
    ]

    const tableDataMapped = useMemo(() => {
        let arr = [...tableData]

        if (router.query.page && !isNaN(Number(router.query.page))) {
            const page = parseInt(Number(router.query.page).toString())
            arr = arr.slice((page - 1) * pagination.perPage, ((page - 1) * pagination.perPage) + pagination.perPage)
        } else {
            arr = arr.slice(0, pagination.perPage)
        }

        if (search !== '') {
            arr = arr.filter((v) => v.name_zh.toLowerCase().includes(search.toLowerCase()))
        }

        switch (sortBy) {
            case 'default':
            default:
                arr = arr.sort((a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1)
                break
        }
        return arr
    }, [tableData, search, sortBy, router.query, pagination.perPage])

    const getTableData = async () => {
        const res = await api({
          method: 'GET',
          url: '/admin/class_types'
        })
        if (res.code === 0) {
          setTableData(res.data)
        } else {
          setTableData([])
        }
    }
    
    useEffect(() => {
        getTableData()
    }, [])

  return (
    <LayoutAdmin>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>課程系列管理</Heading>
          <div className="mt-4 flex max-w-xl gap-4 flex-wrap">
            <div className='w-full sm:w-auto'>
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜尋名稱..."
                />
              </InputGroup>
            </div>
            <div className='w-full sm:w-auto'>
              <Select onChange={(e) => setSortBy(e.target.value)}>
                {sortByList.map((v) => {
                    return (
                        <option key={v.value} value={v.value}>{v.label}</option>
                    )
                })}
              </Select>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/class_types/creation')}>
          建立
        </Button>
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
                {tableDataMapped.map((row) => {
                    return (
                      <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            <Dropdown>
                              <DropdownButton plain aria-label="More options">
                                <EllipsisVerticalIcon />
                                操作
                              </DropdownButton>
                              <DropdownMenu anchor="bottom end">
                                  <DropdownItem>預覽</DropdownItem>
                                  <DropdownItem href={`/admin/class_types/${row.id}/view`}>查看</DropdownItem>
                                  <DropdownItem href={`/admin/class_types/${row.id}/edit`}>編輯</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
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
