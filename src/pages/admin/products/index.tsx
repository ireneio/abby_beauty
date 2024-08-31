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
import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce';
import Head from 'next/head'
import Swal from 'sweetalert2'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('default')
    const sortByList = [
        { label: '按建立日期排序 (從新到舊)', value: 'default' },
        { label: '按上架狀態排序', value: 'hidden' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        perPage: 10,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const tableHeaders = [
      { label: '縮圖', value: 'image' },
      { label: '系列', value: 'product_type_name' },
      { label: '中文名稱', value: 'name_zh' },
      { label: '上架狀態', value: 'hidden' },
      { label: '操作', value: 'action' },
    ]

    const getTableData = async (params: any) => {
        const res = await api({
          method: 'GET',
          url: '/admin/products',
          params,
        })
        if (res.code === 0) {
          setTableData(res.data.products)
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

    const toggleHideProduct = async (id: string, value: boolean) => {
      const res = await api({
        method: 'POST',
        url: `/admin/products/${id}`,
        data: {
          hidden: value,
        }
      })
      return res
    }

    const handleToggleHidden = async (obj: any) => {
      const result = await Swal.fire({
        icon: 'info',
        title: `確認要${obj.hidden ? '上架' : '下架'}此產品嗎?`,
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
      })

      if (result.isConfirmed) {
        Swal.fire({
          title: '加載中...',
          showConfirmButton: false,
          didOpen() {
              Swal.showLoading()
          }
        })
        const removeRes = await toggleHideProduct(obj.id, !obj.hidden)
        Swal.close()
        if (removeRes) {
          await fetchData()
          Swal.fire({
            icon: 'success',
            title: `已${obj.hidden ? '上架' : '下架'}`,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '失敗',
            text: '請稍後再試。',
          });
        }
      }
    }

    const fetchData = async () => {
      await getTableData({
        page: pagination.currentPage,
        perPage: pagination.perPage,
        search: search,
        sortBy: sortBy === 'hidden' ? 'hidden' : 'created_at',
        sortDirection: sortBy === 'hidden' ? 'asc' : 'desc'
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
        <title>產品管理</title>
        <meta name="description" content="產品列表管理" />
      </Head>
      <LayoutAdmin>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-sm:w-full sm:flex-1">
            <Heading>產品管理/產品列表管理</Heading>
            <div className="mt-4 flex max-w-xl gap-4 flex-wrap">
              <div className='w-full sm:w-auto'>
                <InputGroup>
                  <MagnifyingGlassIcon />
                  <Input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="搜尋名稱或系列..."
                  />
                </InputGroup>
              </div>
              <div className='w-full sm:w-auto'>
                <Select onChange={(e) => handleSortBy(e.target.value)}>
                  {sortByList.map((v) => {
                      return (
                          <option key={v.value} value={v.value}>{v.label}</option>
                      )
                  })}
                </Select>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push('/admin/products/creation')}>
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
                              {row.images.length > 0 ?
                                <img
                                  src={row.images[0].url}
                                  className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] object-contain'
                                /> :
                                <div className='w-[6rem] h-[6rem]'></div>
                              }
                            </TableCell>
                            <TableCell>{row.product_type_name}</TableCell>
                            <TableCell>
                              {row.name_zh}
                            </TableCell>
                            <TableCell>
                              <Badge color={row.hidden ? 'zinc' : 'lime'}>
                                {row.hidden ? '已下架' : '已上架'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dropdown>
                                <DropdownButton plain aria-label="More options">
                                  <EllipsisVerticalIcon />
                                  操作
                                </DropdownButton>
                                <DropdownMenu anchor="bottom end">
                                    {/* <DropdownItem>預覽</DropdownItem> */}
                                    <DropdownItem href={`/admin/products/${row.id}/view`}>查看</DropdownItem>
                                    <DropdownItem href={`/admin/products/${row.id}/edit`}>編輯</DropdownItem>
                                    <DropdownItem onClick={() => handleToggleHidden(row)}>
                                      {row.hidden ? '上架' : '下架'}
                                    </DropdownItem>
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
