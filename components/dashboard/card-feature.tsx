import React from 'react'
import { ListChecks,ArrowUpRight, Handshake, FileText, MessagesSquare } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CardFeature = () => {
  return (
    <div className="flex gap-x-4">
      {dataFeature.map(item =>
        <div className='bg-white rounded-lg p-4 w-[234px] flex flex-col justify-between gap-y-2' key={item.id}>
          <item.icon className='text-rose-600 w-8 h-8' />
          <p className='font-normal text-sm text-slate-400'>{item.desc}</p>
          <Link href={"/dashboard"} passHref legacyBehavior>
            <div className='flex justify-end flex-col items-end gap-y-2'>
              {item.isComing && 
                <div className='text-[6px] border border-[#5D5FEF] px-3 rounded-sm text-[#5D5FEF] py-[2px]'>Commig Soon</div>
              }
              <Button className={cn('bg-rose-600 text-sm font-normal h-fit w-fit py-1 px-4 flex', item.isComing && 'bg-transparent text-[#5D5FEF] border border-[#5D5FEF]')}>{item.btnTitle}<ArrowUpRight className='w-4'/></Button>
            </div>
          </Link>
        </div>
        )}
    </div>
  )
}

export default CardFeature


const dataFeature = [
  {
    id:1,
    icon: ListChecks,
    desc:"Beautifully designed components built with Radix UI and Tailwind CSS.",
    url:'/dashboard',
    isComing: false,
    btnTitle:"Create Job"
    
  },
  {
    id:2,
    icon: Handshake,
    desc:"Beautifully designed components built with Radix UI and Tailwind CSS.",
    url:'/dashboard',
    isComing: false,
    btnTitle:"Integration"
    
  },
  {
    id:3,
    icon: FileText,
    desc:"Beautifully designed components built with Radix UI and Tailwind CSS.",
    url:'/dashboard',
    isComing: false,
    btnTitle:"Upload of Candidates"
    
  },
  {
    id:4,
    icon: MessagesSquare,
    desc:"Beautifully designed components built with Radix UI and Tailwind CSS.",
    url:'/coming',
    isComing: true,
    btnTitle:"Automatic Interview"

  },
]