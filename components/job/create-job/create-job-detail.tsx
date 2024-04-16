'use client'
import React, { useState } from 'react'
import { ArrowRight, Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
 
const CreateJobDetail = () => {
  const [value, setValue] = useState('');

  return (
    <div  className='flex flex-col w-full bg-white items-center justify-center rounded-md py-8 px-12'>
      <h3 className='text-2xl font-semibold text-center mb-12'>Create Job Details</h3>
      <div className='flex w-full gap-x-3'>
        <div className='w-[445px] space-y-2'>
          <div className='border rounded-md  overflow-hidden'>
            <div className='border-b p-4'>
              <div className='flex items-center gap-2'>
                <span>
                  <Info className='text-green-600 w-6 h-6'/>
                </span>
                <p className='text-second-text text-sm font-normal'>Directly Paste your Job Description here or create new with our AI generated suggestions</p>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className='bg-slate-200 p-2'>
                <AccordionTrigger className='h-auto p-0 text-sm font-normal'>Job Description</AccordionTrigger>
                <AccordionContent className=''>
                  <Textarea rows={10}/>
                  <div className='flex justify-between items-center'>
                    <Button variant='ghost' className='w-auto p-0 text-sm font-normal hover:bg-transparent'> Regenerate</Button>
                    <Button variant='ghost' className='w-auto p-0 text-sm font-normal hover:bg-transparent space-x-1'>Add to Editor <ArrowRight className=''/></Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className='border rounded-md  overflow-hidden'>
           
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className='bg-slate-200 p-2'>
                <AccordionTrigger className='h-auto p-0 text-sm font-normal'>Skill</AccordionTrigger>
                <AccordionContent className=''>
                  <Textarea/>
                  <div className='flex justify-between items-center'>
                    <Button variant='ghost' className='w-auto p-0 text-sm font-normal hover:bg-transparent'> Regenerate</Button>
                    <Button variant='ghost' className='w-auto p-0 text-sm font-normal hover:bg-transparent space-x-1'>Add to Editor <ArrowRight className=''/></Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className='bg-slate-200 w-[742px]'>
          <div className='bg-white'>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJobDetail