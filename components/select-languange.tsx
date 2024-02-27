'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const SelectLanguage = ({ lang }: { lang: string }) => {
  const locale = useLocale();
  const { replace } = useRouter();

  const handlerChangeSelect = (val: string) => {
    replace(`/${val}`);
  };
  return (
    <Select
      defaultValue={locale}
      onValueChange={(val) => handlerChangeSelect(val)}
    >
      <SelectTrigger className="w-fit text-primary-foreground focus:ring-0 focus:ring-ring focus:ring-offset-0">
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
