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
import LayoutAdmin from '@/components/layout/LayoutAdmin'
import useApi from '@/lib/hooks/useApi'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export const metadata: Metadata = {
  title: '課程',
  description: '課程列表管理',
}

export default function Page() {
    const router = useRouter()
    const { api } = useApi()
    const [sortBy, setSortBy] = useState('default')
    const sortByList = [
        { label: '按建立日期排序 (從新到舊)', value: 'default' },
        { label: '按可預約狀態排序', value: 'available_for_reservation' },
    ]
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
        perPage: 10,
    })
    const [classes, setClasses] = useState<any[]>([])

    const classesMapped = useMemo(() => {
        let arr = [...classes]

        if (router.query.page && !isNaN(Number(router.query.page))) {
            const page = parseInt(Number(router.query.page).toString())
            arr = arr.slice((page - 1) * pagination.perPage, ((page - 1) * pagination.perPage) + pagination.perPage)
        } else {
            arr = arr.slice(0, pagination.perPage)
        }

        if (search !== '') {
            arr = arr.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
        }

        switch (sortBy) {
            case 'available_for_reservation':
                arr = arr.sort((a, b) => a.available_for_reservation ? -1 : 1)
                break
            case 'default':
            default:
                arr = arr.sort((a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1)
                break
        }
        return arr
    }, [classes, search, sortBy, router.query, pagination.perPage])

    const getClasses = async () => {
        const res = await api({
          method: 'GET',
          url: '/admin/classes'
        })
        if (res.code === 0) {
          setClasses(res.data)
        } else {
          setClasses([])
        }
    }

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteClass = async (id: string) => {
        const res = await api({
        method: 'DELETE',
            url: `/admin/classes/${id}`,
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
            await getClasses()
            setShowDeleteConfirm(false)
        }
        setDeleteLoading(false)
    }
    
    useEffect(() => {
        getClasses()
    }, [])

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
          <Heading>課程列表管理</Heading>
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
        <Button onClick={() => router.push('/admin/classes/creation')}>
            建立
        </Button>
      </div>
      <ul className="mt-10">
        {classesMapped.map((v, index) => (
            <li key={v.id}>
              <Divider soft={index > 0} />
              <div className="flex items-center justify-between">
                <div key={v.id} className="flex gap-6 py-6">
                  <div className="w-32 shrink-0">
                    <img className="aspect-[3/2] rounded-lg shadow object-contain" src={v.image_cover} alt="" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-base/6 font-semibold">
                        {v.name}
                    </div>
                    <div className="text-xs/6 text-zinc-500">
                      時長: {v.minutes} 分鐘
                    </div>
                    {/* <div className="text-xs/6 text-zinc-600">
                      {v.ticketsSold}/{v.ticketsAvailable} tickets sold
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* <Badge color={v.available_for_reservation ? 'lime' : 'zinc'}>
                    {v.available_for_reservation ? '可預約' : '不可預約'}
                  </Badge> */}
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisVerticalIcon />
                      操作
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                        <DropdownItem>預覽</DropdownItem>
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
                onChange={(value) => setPagination((prev) => ({ ...prev, perPage: value }))}
            />
        </div>
        <div className='w-full sm:w-auto ml-auto'>
            <Paginator
                    currentPage={router.query.page || 1}
                    total={classes.length}
                    perPage={pagination.perPage}
            />
        </div>
      </div>
    </LayoutAdmin>
  )
}
