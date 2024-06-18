'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useTranslations } from 'next-intl';

export const FilterJob = () => {
  const { orgId } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('JobList')

  const pathname = usePathname();
  const { replace } = useRouter();

  // FUTURE IMPROVEMENT: add debounce on search input
  function handleSearch(
    query: 'location' | 'jobName' | 'status',
    term: string,
  ) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(query, term);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-end justify-between">
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">{t('filter_find')}</label>
        <Input
          placeholder={t('filter_location')}
          defaultValue={searchParams.get('location') || ''}
          onChange={(e) => handleSearch('location', e.target.value)}
        />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">{t('filter_find')}</label>
        <Input
          placeholder={t('filter_job')}
          defaultValue={searchParams.get('jobName') || ''}
          onChange={(e) => handleSearch('jobName', e.target.value)}
        />
      </div>
      <div className="max-w-[200px] flex-1">
        <label className="mb-1 ml-4 text-sm">{t('table_statusLabel')}</label>
        <Select onValueChange={(value) => handleSearch('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('filter_statusActive')} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Active">{t('filter_statusActive')}</SelectItem>
            <SelectItem value="Not_Analyzed">{t('filter_statusNotAnalyzed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link href={`/${orgId}/job/create`}>
        <Button>+ {t('table_createJobCta')}</Button>
      </Link>
    </div>
  );
};
