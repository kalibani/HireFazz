import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fragment, forwardRef, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (props, ref) => {
    const { placeholder, tags, setTags, className } = props;

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
        }
        setInputValue('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <Fragment>
        <div
          className={`flex w-full flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}
        >
          <div className="flex w-full flex-row flex-wrap gap-y-2 items-center gap-x-2 rounded-lg border-2 p-2">
            <div className="flex flex-wrap gap-2 w-fit">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex h-8 items-center w-fit truncate rounded-md border bg-secondary pl-2 text-sm text-secondary-foreground transition-all hover:bg-secondary/80"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeTag(tag)}
                    className={cn('h-full px-3 py-1 hover:bg-transparent')}
                  >
                    <X size={14} />
                  </Button>
                </span>
              ))}
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="border-none px-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            </div>
          </div>
        </div>
      </Fragment>
    );
  },
);

TagInput.displayName = 'TagInput';
