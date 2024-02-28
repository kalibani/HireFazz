'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { removeLanguagePrefix } from '@/lib/utils';
import { useRouter } from '@/src/navigation-intl';

const SelectLanguage = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const newPathPrefix = removeLanguagePrefix(pathname);
  const handlerChangeSelect = (val: string) => {
    router.replace(newPathPrefix, { locale: val });
  };
  return (
    <Select
      defaultValue={locale}
      onValueChange={(val) => handlerChangeSelect(val)}
    >
      <SelectTrigger className="w-fit text-primary-foreground focus:ring-0 focus:ring-ring focus:ring-offset-0 border-0">
        <SelectValue placeholder="EN" className="text-primary-foreground" />
      </SelectTrigger>
      <SelectContent className="w-fit min-w-fit">
        <SelectGroup className=" p-2 w-fit">
          <SelectItem
            className="w-fit flex flec-row items-center gap-x-2"
            value="en"
          >
            <span>&#127482;&#127480; EN</span>
          </SelectItem>
          <SelectItem value="id">
            <span>&#x1F1EE;&#x1F1E9; ID</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectLanguage;
