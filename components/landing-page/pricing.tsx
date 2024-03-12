import { cn } from '@/lib/utils';
import React from 'react';

// temporary type any
const Pricing = ({ items }: { items: any[] }) => {
  return (
    <div className="grid grid-cols-5 mt-11 text-center">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`pt-4 h-[386px] gap-y-3 flex flex-col items-center text-center ${
            index % 2 === 0 ? 'bg-[#EAE7FE]' : 'bg-white'
          } rounded-md`}
        >
          <div className="flex mb-6 flex-col min-w-[132px] h-[65px] border-b border-[#D6D6D6]  pb-3">
            <h4
              className={cn(
                'capitalize font-medium text-2xl',
                item.id === 1 && 'font-normal text-base'
              )}
            >
              {item.title || ''}
            </h4>
            <p>{item.price}</p>
          </div>
          {item.benef.map((val: any, index: number) => (
            <p key={index}>
              {val === 'yes' ? '✅' : val === 'no' ? '❎' : val}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Pricing;
