'use client'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './button'

interface PaginationProps {
    activePage?: number
    totalItems: number
    itemsPerPage: number
    onPageChange?: (page: number) => void
}

const Pagination: FC<PaginationProps> = ({ activePage, totalItems, itemsPerPage, onPageChange }) => {
  const [page, setPage] = useState(1)
  const isInitialPageSetted = useRef(false)
  const totalPage = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    // if there is initial page, then set the page to initial page only once
    if (activePage && !isInitialPageSetted.current) {
      setPage(activePage)
      isInitialPageSetted.current = true
    }
  }, [activePage])

  const paginationElements = useMemo(() => {
    if (totalPage <= 5) return [1, 2, 3, 4, 5]

    const result:  number[] = [1]
    const isFirstThreeItem = page <= 3
    const isLastThreeItem = page > totalPage - 3

    // insert '...' base on current page position using array of number
    // if need to be ellipsis, then put NaN as value
    // only 3 condition, first (<=3), last (> total-3), and middle
    if (isFirstThreeItem) {
      result.push(2, 3, NaN, totalPage)
    } else if (isLastThreeItem) {
      result.push(NaN, totalPage - 2, totalPage - 1, totalPage)
    } else {
      result.push(NaN, page, NaN, totalPage)
    }

    return result
  }, [page, totalPage])

  const handlePageChange = (newPage: number) => {
    // not trigger func if click on the same page
    if (page === newPage) return

    setPage(newPage)
    onPageChange?.(newPage)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Prev
      </Button>
  
      {paginationElements.map((pageElement, index) => {
        if (Number.isNaN(pageElement)) {
          return <span key={index + Math.random() * 1000} className="px-2">...</span>
        } else {
          return (
            <Button key={pageElement + index} variant={page === Number(pageElement) ? 'default' : 'outline'} onClick={() => handlePageChange(pageElement)}>
              {pageElement}
            </Button>
          )
        }
      })}

      <Button
        variant="ghost"
        disabled={page === totalPage}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination