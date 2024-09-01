import DialogDeleteConfirm from '@/components/admin/DialogDeleteConfirm'
import Paginator from '@/components/admin/Paginator'
import SelectPerPage from '@/components/admin/SelectPerPage'
import { Button } from '@/components/common/button'
import { Divider } from '@/components/common/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/common/dropdown'
import { Heading } from '@/components/common/heading'
import { Input, InputGroup } from '@/components/common/input'
import { Select } from '@/components/common/select'
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { debounce } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('default')
    const sortByList = [
      { label: '按建立日期排序 (從新到舊)', value: 'default' },
      // { label: '按可預約狀態排序', value: 'available_for_reservation' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
      total: 0,
      perPage: 10,
      currentPage: 1,
    })
    const [tableData, setTableData] = useState<any[]>([])

    const deleteClass = async (id: string) => {
      const res = await api({
      method: 'DELETE',
          url: `/admin/classes/${id}`,
      })
      return res
    }

    const handleDelete = async (row: any) => {
      const result = await Swal.fire({
        icon: 'info',
        title: '確認要刪除此課程項目嗎?',
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
        const removeRes = await deleteClass(row.id)
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
    
    const getTableData = async (params: any) => {
      const res = await api({
        method: 'GET',
        url: '/admin/classes',
        params,
      })
      if (res.code === 0) {
        setTableData(res.data.classes)
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
        <title>課程管理/課程列表管理</title>
        <meta name="description" content="課程列表管理" />
      </Head>
      <LayoutAdmin>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-sm:w-full sm:flex-1">
            <Heading>課程管理/課程列表管理</Heading>
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
            </div>
          </div>
          <Button onClick={() => router.push('/admin/classes/creation')}>
            建立
          </Button>
        </div>
        <ul className="mt-10">
          {tableData.map((v, index) => (
              <li key={v.id}>
                <Divider soft={index > 0} />
                <div className="flex items-center justify-between">
                  <div key={v.id} className="flex gap-6 py-6">
                    {/* <div className="w-32 shrink-0">
                      <img className="aspect-[3/2] rounded-lg shadow object-contain" src={v.image_cover} alt="" />
                    </div> */}
                    <div className="space-y-1.5">
                      <div className="text-base/6 font-semibold">
                        {v.name}
                      </div>
                      {/* <div className="text-xs/6 text-zinc-500">
                        時長: {v.minutes} 分鐘
                      </div> */}
                      <div className="text-xs/6 text-zinc-500">
                        系列: {v.class_type_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* <Badge color={v.available_for_reservation ? 'lime' : 'zinc'}>
                      {v.available_for_reservation ? '可預約' : '不可預約'}
                    </Badge> */}
                    <Dropdown>
                      <DropdownButton plain aria-label="操作">
                        <EllipsisVerticalIcon />
                        操作
                      </DropdownButton>
                      <DropdownMenu anchor="bottom end">
                          <DropdownItem href={`/admin/classes/${v.id}/view`}>查看</DropdownItem>
                          <DropdownItem href={`/admin/classes/${v.id}/edit`}>編輯</DropdownItem>
                          <DropdownItem onClick={() => handleDelete(v.id)}>刪除</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </li>
          ))}
        </ul>
        <div className='flex flex-wrap space-y-4'>
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
