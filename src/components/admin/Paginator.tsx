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

    const pagesMap = useMemo(() => {
        const _currentPage = currentPage; // 1-based index
        const _totalPages = totalPages;   // 1-based index
    
        const pages = [];
    
        // Always include the first page
        pages.push(1);

        if (_totalPages === 1) {
            return pages
        }
    
        // Add ellipsis if the current page is far enough from the start
        if (_currentPage > 4) {
            pages.push("...");
        }
    
        // Calculate start and end for middle pages
        const startPage = Math.max(2, _currentPage - 1);
        const endPage = Math.min(_totalPages - 1, _currentPage + 1);
    
        // Add the middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
    
        // Add ellipsis if the current page is far enough from the end
        if (_currentPage < _totalPages - 3) {
            pages.push("...");
        }
    
        // Always include the last page
        pages.push(_totalPages);
    
        return pages;
    }, [totalPages, currentPage]);
    

    const PageComponents = () => {
        return (
            pagesMap.map((page, i) => {
                if (page === '...') {
                    return (
                        <PaginationGap key={i} />
                    )
                }
                const _page = Number(page)
                return (
                    <PaginationPage
                        key={i}
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