import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Button } from '@/components/common/button'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
import { Heading } from '@/components/common/heading'
import { Input, InputGroup } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('publish_date')
    const sortByList = [
      { label: '按發佈日期排序 (從新到舊)', value: 'publish_date' },
      { label: '按建立日期排序 (從新到舊)', value: 'created_at' },
    ]
    const [search, setSearch] = useState('')
    const [searchDates, setSearchDates] = useState({
      startDate: '',
      endDate: '',
    })
    const [pagination, setPagination] = useState({
      total: 0,
      perPage: 10,
      currentPage: 1,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const tableHeaders = [
      { label: '發佈日期', value: 'publish_date' },
      { label: '標題', value: 'title' },
      { label: '操作', value: 'action' },
    ]

    const getTableData = async (params: any) => {
      const res = await api({
        method: 'GET',
        url: '/admin/articles',
        params,
      })
      if (res.code === 0) {
        setTableData(res.data.rows)
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
        sortBy: sortBy,
        sortDirection: 'desc',
        startDate: searchDates.startDate,
        endDate: searchDates.endDate,
      })
    }
    
    useEffect(() => {
      const debouncedFetchData = debounce(fetchData, 800);

      debouncedFetchData()
      
      return () => debouncedFetchData.cancel()
    }, [pagination.currentPage, pagination.perPage, search, sortBy, searchDates.startDate, searchDates.endDate])

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

    const handleSearchStartDate = (value: string) => {
      const _value = value.trim()
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, start_date: _value },
      })
      setSearchDates((prev) => ({ ...prev, startDate: _value }))
    }

    const handleSearchEndDate = (value: string) => {
      const _value = value.trim()
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1, end_date: _value },
      })
      setSearchDates((prev) => ({ ...prev, endDate: _value }))
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
      if (router.query.start_date) {
        setSearchDates((prev) => ({ ...prev, startDate: router.query.start_date as string }))
      }
    }, [router.query.start_date])

    useEffect(() => {
      if (router.query.end_date) {
        setSearchDates((prev) => ({ ...prev, endDate: router.query.end_date as string }))
      }
    }, [router.query.end_date])

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

    const handleDeleteAction  = async (id: string) => {
      const res = await api({
        method: 'DELETE',
        url: `/admin/articles/${id}`
      })
      if (res.code === 0) {
        return true
      }
      return false
    }

    const handleDeleteConfirm = async (row: any) => {
      const result = await Swal.fire({
        icon: 'info',
        title: '確認要刪除此文章嗎?',
        showCancelButton: true,
        confirmButtonText: '確認刪除',
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
        const removeRes = await handleDeleteAction(row.id)
        Swal.close()
        if (removeRes) {
          await fetchData()
          Swal.fire({
            icon: 'success',
            title: '已刪除',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '刪除失敗',
            text: '請稍後再試。',
          });
        }
      }
    }

  return (
    <LayoutAdmin>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>文章管理/文章列表管理</Heading>
          <div className="mt-4 max-w-4xl gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <div className='w-full sm:w-auto'>
              <span className='text-sm'>搜尋</span>
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜尋標題..."
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
            <div className='w-full sm:w-auto'>
              <span className='text-sm'>發佈日期(起始)</span>
              <InputGroup>
                <Input
                  type="date"
                  value={searchDates.startDate}
                  onChange={(e) => handleSearchStartDate(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className='w-full sm:w-auto'>
              <span className='text-sm'>發佈日期(結束)</span>
              <InputGroup>
                <Input
                  type="date"
                  value={searchDates.endDate}
                  onChange={(e) => handleSearchEndDate(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/articles/posts/creation')}>
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
                          <TableCell>
                            {dayjs(row.publish_date).format('YYYY-MM-DD')}
                          </TableCell>
                          <TableCell>
                            <div className='truncate max-w-[200px] md:max-w-[300px]'>{row.title}</div>
                          </TableCell>
                          <TableCell>
                            <Dropdown>
                              <DropdownButton plain aria-label="操作">
                                <EllipsisVerticalIcon />
                                操作
                              </DropdownButton>
                              <DropdownMenu anchor="bottom end">
                                  <DropdownItem href={`/admin/articles/posts/${row.id}/view`}>查看</DropdownItem>
                                  <DropdownItem href={`/admin/articles/posts/${row.id}/edit`}>編輯</DropdownItem>
                                  <DropdownItem onClick={() => handleDeleteConfirm(row)}>
                                    <span className='text-danger'>
                                      刪除
                                    </span>
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
  )
}
