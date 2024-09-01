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
import { debounce } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('order')
    const sortByList = [
      { label: '按前台顯示順序排序', value: 'order' },
      { label: '按建立日期排序 (從新到舊)', value: 'default' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
      total: 0,
      perPage: 10,
      currentPage: 1,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const tableHeaders = [
      { label: '縮圖', value: 'image' },
      { label: '名稱', value: 'name_zh' },
      { label: '操作', value: 'action' },
    ]

    const handlePreview = (row: any) => {
      window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/product/series/${row.id}`)
    }

    const getTableData = async (params: any) => {
      const res = await api({
        method: 'GET',
        url: '/admin/product_types',
        params,
      })
      if (res.code === 0) {
        setTableData(res.data.productTypes)
        setPagination((prev) => {
          return {
            ...prev,
            total: res.data.total
          }
        })
      } else {
        setTableData([])
        setPagination({
          currentPage: 1,
          perPage: 10,
          total: 0
        })
      }
    }
    
    const fetchData = async () => {
      await getTableData({
        page: pagination.currentPage,
        perPage: pagination.perPage,
        search: search,
        sortBy: 'created_at',
        sortDirection: 'desc'
      })
    }
    
    useEffect(() => {
      const debouncedFetchData = debounce(fetchData, 800);

      debouncedFetchData()
      
      return () => debouncedFetchData.cancel()
    }, [pagination.currentPage, pagination.perPage, search, sortBy])

    useEffect(() => {
      if (router.query.page) {
        setPagination((prev) => ({
          ...prev,
          currentPage: Number(router.query.page)
        }))
      }
    }, [router.query.page])

    const handleSearch = (value: string) => {
      const _value = value.trim()
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, search: _value },
      })
      setSearch(_value)
    }

    const handleSortBy = (value: string) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, sortBy: value },
      })
      setSortBy(value)
    }

    const handlePerPage = (value: number) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, perPage: value },
      })
      setPagination((prev) => ({ ...prev, page: 1, perPage: value }))
    }

    useEffect(() => {
      if (router.query.search) {
        setSearch(router.query.search as string)
      }
    }, [router.query.search])

    useEffect(() => {
      if (router.query.sortBy) {
        setSortBy(router.query.sortBy as string)
      }
    }, [router.query.sortBy])

    useEffect(() => {
      if (router.query.perPage) {
        setPagination((prev) => ({ ...prev, perPage: Number(router.query.perPage) }))
      }
    }, [router.query.perPage])

  return (
    <>
      <Head>
        <title>產品系列管理</title>
        <meta name="description" content="產品系列管理" />
      </Head>
      <LayoutAdmin>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-sm:w-full sm:flex-1">
            <Heading>產品管理/產品系列管理</Heading>
            <div className="mt-4 max-w-4xl gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              <div className='w-full sm:w-auto'>
                <span className='text-sm'>搜尋</span>
                <InputGroup>
                  <MagnifyingGlassIcon />
                  <Input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="搜尋名稱..."
                  />
                </InputGroup>
              </div>
              <div className='w-full sm:w-auto'>
                <span className='text-sm'>排序</span>
                <Select value={sortBy} onChange={(e) => handleSortBy(e.target.value)}>
                  {sortByList.map((v) => {
                    return (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    )
                  })}
                </Select>
              </div>
              <div>
                <Button onClick={() => router.push('/admin/product_types/sort')}>調整前台排序</Button>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push('/admin/product_types/creation')}>
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
                  {tableData.map((row) => {
                      return (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium">
                              {row.image_cover ?
                                <img
                                  src={row.image_cover}
                                  className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] object-contain'
                                /> :
                                <div className='w-[6rem] h-[6rem]'></div>
                              }
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Dropdown>
                                <DropdownButton plain aria-label="操作">
                                  <EllipsisVerticalIcon />
                                  操作
                                </DropdownButton>
                                <DropdownMenu anchor="bottom end">
                                    <DropdownItem onClick={() => handlePreview(row)}>預覽</DropdownItem>
                                    <DropdownItem href={`/admin/product_types/${row.id}/view`}>查看</DropdownItem>
                                    <DropdownItem href={`/admin/product_types/${row.id}/edit`}>編輯</DropdownItem>
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
                onChange={(value) => handlePerPage(value)}
              />
          </div>
          <div className='w-full sm:w-auto ml-auto'>
              <Paginator
                currentPage={pagination.currentPage}
                total={pagination.total}
                perPage={pagination.perPage}
              />
          </div>
        </div>
      </LayoutAdmin>
    </>
  )
}
