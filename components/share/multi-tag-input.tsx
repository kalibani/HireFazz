import { PictureInPicture2, X } from 'lucide-react';
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
        addTag();
      }
    };

    const addTag = () => {
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <Fragment>
        <div
          className={`flex w-full flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}
        >
          <div className="mb-3 flex w-full flex-col flex-wrap items-center gap-y-4 rounded-lg border p-2">
            <div className="flex w-full items-center gap-x-2">
              <PictureInPicture2 className="size-4 text-primary" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="h-auto border-none p-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {inputValue.length > 2 && (
              <Button className="w-full capitalize" onClick={addTag}>
                New {inputValue}
              </Button>
            )}
          </div>
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex h-fit min-w-16 items-center gap-2 rounded-md  bg-primary px-2 py-1 text-sm capitalize">
                <p className="text-center text-white">{tag}</p>
                <div
                  onClick={() => removeTag(tag)}
                  className="absolute -right-2 -top-2 z-10 flex size-4 cursor-pointer items-center justify-center  rounded-full bg-slate-400"
                >
                  <X className="size-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },
);

TagInput.displayName = 'TagInput';
