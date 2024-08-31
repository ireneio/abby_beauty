import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Badge } from '@/components/common/badge'
import { Button } from '@/components/common/button'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
import { Heading } from '@/components/common/heading'
import { Input, InputGroup } from '@/components/common/input'
import { Select } from '@/components/common/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

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
      { label: '縮寫標題', value: 'title_short' },
      { label: '上架狀態', value: 'hidden' },
      { label: '操作', value: 'action' },
    ]

    const handlePreview = (row: any) => {
      window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/trial/${row.slug}`, '_blank')
    }

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

    const toggleHideTrial = async (id: string, value: boolean) => {
      const res = await api({
        method: 'POST',
        url: `/admin/trials/${id}`,
        data: {
          hidden: value,
        }
      })
      return res
    }

    const handleToggleHidden = async (obj: any) => {
      const result = await Swal.fire({
        icon: 'info',
        title: `確認要${obj.hidden ? '上架' : '下架'}此課程嗎?`,
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
        const removeRes = await toggleHideTrial(obj.id, !obj.hidden)
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
        sortBy: sortBy,
        sortDirection: sortBy === 'order' ? 'asc' : 'desc'
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
    <LayoutAdmin>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>體驗課程管理/體驗課程列表管理</Heading>
          <div className="mt-4 flex max-w-xl gap-4 flex-wrap">
            <div className='w-full sm:w-auto'>
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
              <Select value={sortBy} onChange={(e) => handleSortBy(e.target.value)}>
                {sortByList.map((v) => {
                    return (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    )
                })}
              </Select>
            </div>
            <div>
              <Button onClick={() => router.push('/admin/trials/sort')}>調整前台排序</Button>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/trials/creation')}>
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
                            {row.images && row.images.length > 0 ?
                              <Image
                                src={row.images[0].url}
                                alt={row.title_short}
                                width={147}
                                height={147}
                                className='w-[147px] aspect-[1/1] object-contain'
                              /> : null
                            }
                          </TableCell>
                          <TableCell>{row.title_short}</TableCell>
                          <TableCell>
                              <Badge color={row.hidden ? 'zinc' : 'lime'}>
                                {row.hidden ? '已下架' : '已上架'}
                              </Badge>
                            </TableCell>
                          <TableCell>
                            <Dropdown>
                              <DropdownButton plain aria-label="操作">
                                <EllipsisVerticalIcon />
                                操作
                              </DropdownButton>
                              <DropdownMenu anchor="bottom end">
                                  <DropdownItem onClick={() => handlePreview(row)}>預覽</DropdownItem>
                                  <DropdownItem href={`/admin/trials/${row.id}/view`}>查看</DropdownItem>
                                  <DropdownItem href={`/admin/trials/${row.id}/edit`}>編輯</DropdownItem>
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
  )
}
