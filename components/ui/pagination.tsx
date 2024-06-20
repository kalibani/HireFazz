'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { PER_PAGE_ITEMS } from '@/constant'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  activePage?: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ activePage, totalItems, itemsPerPage, onPageChange }) => {
  const [page, setPage] = useState(1)
  const t = useTranslations('Pagination')
  const totalPage = Math.ceil(totalItems / itemsPerPage)
  const prevDisable = page === 1 || totalPage === 0
  const nextDisable = page === totalPage || totalPage === 0

  useEffect(() => {
    if (activePage) {
      setPage(activePage)
    }
  }, [activePage]);

  const paginationElements = useMemo(() => {
    if (totalPage <= 5) {
      return Array.from(Array(totalPage).keys()).map((value) => value + 1);
    }

    const result: number[] = [1];
    const isFirstThreeItem = page <= 3;
    const isLastThreeItem = page > totalPage - 3;

    // insert '...' base on current page position using array of number
    // if need to be ellipsis, then put NaN as value
    // only 3 condition, first (<=3), last (> total-3), and middle
    if (isFirstThreeItem) {
      result.push(2, 3, NaN, totalPage);
    } else if (isLastThreeItem) {
      result.push(NaN, totalPage - 2, totalPage - 1, totalPage);
    } else {
      result.push(NaN, page, NaN, totalPage);
    }

    return result;
  }, [page, totalPage]);

  const handlePageChange = (newPage: number) => {
    // not trigger func if click on the same page
    if (page === newPage) return;

    setPage(newPage);
    onPageChange?.(newPage);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={prevDisable}
        onClick={() => handlePageChange(page - 1)}
      >
        {t('prev_btn')}
      </Button>

      {paginationElements.map((pageElement, index) => {
        if (Number.isNaN(pageElement)) {
          return (
            <span key={index + Math.random() * 1000} className="px-2">
              ...
            </span>
          );
        } else {
          return (
            <Button
              key={pageElement + index}
              variant={page === Number(pageElement) ? 'default' : 'outline'}
              onClick={() => handlePageChange(pageElement)}
            >
              {pageElement}
            </Button>
          );
        }
      })}

      <Button
        variant="ghost"
        disabled={nextDisable}
        onClick={() => handlePageChange(page + 1)}
      >
        {t('next_btn')}
      </Button>
    </div>
  );
};

export default Pagination;

interface PaginationGroupProps {
  perPage: number;
  totalItems: number;
  activePage?: number;
  handlePagination?: (pageType: 'page' | 'per_page', value: string) => void;
}
export const PaginationGroup: FC<PaginationGroupProps> = ({
  perPage,
  totalItems,
  activePage,
  handlePagination,
}) => {
  const t = useTranslations('Pagination')
  return (
    <div className="flex items-center justify-between py-3">
      <div className="max-w-44 flex gap-2 items-center">
        <span>{t('see')}</span>
        <Select
          onValueChange={(value) => handlePagination?.('per_page', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={perPage} defaultValue={perPage} />
          </SelectTrigger>

          <SelectContent>
            {PER_PAGE_ITEMS.map((pageItem) => (
              <SelectItem key={pageItem} value={pageItem}>
                {pageItem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span>{t('list')}</span>
      </div>
      <div className="space-x-2">
        <Pagination
          activePage={activePage}
          itemsPerPage={perPage}
          totalItems={totalItems}
          onPageChange={(page) => handlePagination?.('page', page.toString())}
        />
      </div>
    </div>
  );
};
