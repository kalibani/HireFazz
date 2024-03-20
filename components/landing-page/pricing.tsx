import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import React from 'react';

// temporary type any
const Pricing = ({ items }: { items: any[] }) => {
  return (
    <div className=" overflow-y-auto">
      <div className="mx-auto mt-11  grid w-[1024px] grid-cols-5 text-center">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'flex flex-col items-center rounded-md  text-center',
              index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white'
            )}
          >
            <div className="my-5 mb-6 flex  flex-col items-center justify-end gap-y-5">
              <h4
                className={cn(
                  'text-xl font-medium capitalize',
                  item.id === 1 && 'opacity-0'
                )}
              >
                {item.title || ''}
              </h4>
              <p
                className={cn(
                  'text-xs text-[#4F525A]',
                  item.id === 1 && 'opacity-0'
                )}
              >
                {item.desc}
              </p>
              <p
                className={cn(
                  'text-3xl font-semibold',
                  item.id === 1 && 'mb-2 text-lg font-medium capitalize'
                )}
              >
                {item.price}
              </p>
            </div>
            <div
              className={cn(
                'flex w-full items-center justify-center gap-x-1 py-6',
                index !== 0 && index % 2 === 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              <p>{item.files} cvs</p>
              {item.id !== 1 && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="ml-1.5 mt-0.5 flex cursor-default">
                      <HelpCircle className="h-3 w-3 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      Screening CV Automatically up to {item.files} Candidates
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div
              className={cn(
                'flex w-full items-center justify-center gap-x-1 py-6',
                index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              <p>{item.generate}</p>
              {item.id !== 1 && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="ml-1.5 mt-0.5 flex cursor-default">
                      <HelpCircle className="h-3 w-3 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      Screening CV Automatically up to {item.generate}{' '}
                      Candidates.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div
              className={cn(
                'flex w-full flex-col items-center justify-center gap-x-1 gap-y-4 py-6',
                index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              <p>{item.upload}</p>
              <p>{item.upload}</p>
              <p>{item.upload}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
