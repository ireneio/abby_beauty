import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Button } from '@/components/common/button'
import { Checkbox } from '@/components/common/checkbox'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
import { Heading } from '@/components/common/heading'
import { Input, InputGroup } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('order_home_page')
    const sortByList = [
      { label: '按建立日期排序 (從新到舊)', value: 'default' },
      { label: '按前台顯示順序排序', value: 'order_home_page' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
      total: 0,
      perPage: 10,
      currentPage: 1,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const tableHeaders = [
      { label: '圖片', value: 'image' },
      { label: '縮寫標題', value: 'title_short' },
      { label: '是否顯示於首頁', value: 'show_on_home_page' },
      // { label: '操作', value: 'action' },
    ]

    const getTableData = async (params: any) => {
      const res = await api({
        method: 'GET',
        url: '/admin/trials',
        params,
      })
      if (res.code === 0) {
        setTableData(res.data.trials)
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
        sortDirection: sortBy === 'order_home_page' ? 'asc' : 'desc',
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

    const updateDisplayHomePage = async (row: any, data: any) => {    
      const res = await api({
          method: 'POST',
          url: `/admin/trials/home/${row.id}`,
          data,
      })
      return res
  }

    const handleUpdateDisplayOnHomePage = async (row: any) => {
      Swal.fire({
          title: '加載中...',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen() {
              Swal.showLoading()
          }
      })
      const updateRes = await updateDisplayHomePage(row, { display_on_home_page: !row.display_on_home_page })
      if (updateRes.code === 0) {
        await fetchData()
        Swal.close()
        Swal.fire({
          title: `更新成功`,
          icon: 'success',
        })
      } else {
        Swal.close()
        Swal.fire({
            title: `錯誤(${updateRes.code})`,
            icon: 'error',
        })
      }
    }

  return (
    <LayoutAdmin>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>首頁管理/體驗課程管理</Heading>
          <div className="mt-4 max-w-4xl gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <div className='w-full sm:w-auto'>
              <span className='text-sm'>搜尋</span>
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜尋縮寫標題..."
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
              <Button onClick={() => router.push('/admin/home/trials/sort')}>調整前台排序</Button>
            </div>
          </div>
        </div>
        {/* <Button onClick={() => router.push('/admin/home/trials/creation')}>
          建立
        </Button> */}
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
                            {row.images.length > 0 ?
                              <img
                                src={row.images[0].url}
                                alt="封面圖"
                                className="object-contain min-w-[6rem] w-[6rem] h-[6rem]"
                              /> : <div className='min-w-[6rem] w-[6rem] h-[6rem]'></div>
                            }
                          </TableCell>
                          <TableCell>
                            {row.title_short}
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={row.display_on_home_page} onChange={() => handleUpdateDisplayOnHomePage(row)} />
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
