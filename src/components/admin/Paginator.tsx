import {
    Pagination,
    PaginationGap,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
  } from '@/components/common/pagination'
import { useMemo } from 'react'
  
// TODO
type Props = any

export default function Paginator({ currentPage = 1, total = 0, perPage = 10 }: Props) {
    const totalPages = useMemo(() => {
        if (total && perPage && !isNaN(total) && !isNaN(perPage) && total > 0 && perPage > 0) {
            return Math.ceil(total / perPage)
        }
        return 1
    }, [total, perPage])

    const hasGap = useMemo(() => {
        return totalPages > 6
    }, [totalPages])

    const pagesMap = useMemo(() => {
        const _currentPage = currentPage - 1
        const _totalPages = totalPages - 1
        if (_totalPages <= 5) {
          return Array(_totalPages + 1)
            .fill(0)
            .map((item, index) => index)
        }
        const arr = []
        if (_currentPage + 3 >= _totalPages - 1) {
          arr.push("...")
          arr.push(_totalPages - 4)
          arr.push(_totalPages - 3)
          arr.push(_totalPages - 2)
          arr.push(_totalPages - 1)
          return arr
        }
    
        if (_currentPage !== 0) {
          arr.push(_currentPage - 1)
          arr.push(_currentPage)
        } else {
          arr.push(_currentPage)
          arr.push(_currentPage + 1)
        }
        arr.push("...")
        arr.push(_totalPages - 2)
        arr.push(_totalPages - 1)
        return arr
      }, [totalPages, currentPage])

    const PageComponents = () => {
        return (
            pagesMap.map((page) => {
                if (page === '...') {
                    return (
                        <PaginationGap />
                    )
                }
                const _page = Number(page) + 1
                return (
                    <PaginationPage
                        key={_page}
                        href={`?page=${_page}`}
                        current={Number(currentPage) === _page}
                    >
                        {_page}
                    </PaginationPage>
                )
            })
        )
    }

    return (
        <Pagination>
            <PaginationPrevious href={Number(currentPage) === 1 ? undefined : `?page=${Number(currentPage) - 1}`}>
                <div className='sm:hidden'>上一頁</div>
                <div className='hidden sm:block'>{''}</div>
            </PaginationPrevious>
            <PaginationList>
                <PageComponents />
            </PaginationList>
            <PaginationNext href={Number(currentPage) === totalPages ? undefined : `?page=${Number(currentPage) + 1}`}>
                <div className='sm:hidden'>下一頁</div>
                <div className='hidden sm:block'>{''}</div>
            </PaginationNext>
        </Pagination>
    )
}