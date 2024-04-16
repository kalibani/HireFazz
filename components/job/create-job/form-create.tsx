'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
 
export const formSchemaCreateJob = z.object({

  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  fromNominal: z.string().optional(),
  toNominal: z.string().optional(),
  experiences:z.string(),
  workModel:z.string(),
  companyName:z.string(),
  currency:z.string(),
})
 

const FormCreate = ({ onSubmit }: { onSubmit: (values:any) => void }) => {
  const form = useForm<z.infer<typeof formSchemaCreateJob>>({
    resolver: zodResolver(formSchemaCreateJob),
    defaultValues: {
      title:'',
      companyName:'',
      workModel:'remote',
      currency:'IDR',
      experiences:"0",
      fromNominal:'',
      toNominal:'',
      location:'',
    },
  })
    
 
  return (
      <div className='w-1/2'>
        <h3 className='text-2xl font-semibold text-center'>Create New Job</h3>
        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-5  mt-10 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'>Title *</FormLabel>
                  <FormControl className='tex-slate-400'>
                    <Input placeholder="Job title" {...field} className='w-full h-auto text-sm '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'>Location *</FormLabel>
                  <FormControl className='tex-slate-400'>
                    <Input placeholder="Location Applicant" {...field} className='w-full h-auto text-sm '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full items-end justify-between'>
              <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'>Average Salary (per month)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-52">
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="US">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="fromNominal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'>(optional)</FormLabel>
                  <FormControl className='tex-slate-400'>
                    <Input  placeholder="From" {...field} className='w-full h-auto text-sm '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="toNominal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'></FormLabel>
                  <FormControl className='tex-slate-400'>
                    <Input placeholder="Job title" {...field} className='w-full h-auto text-sm '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>


            <div className='flex w-full items-end justify-between gap-x-4'>
              <FormField
              control={form.control}
              name="experiences"
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-sm font-normal'>Average Salary (per month)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0 year</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
              
              <FormField
              control={form.control}
              name="workModel"
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel className='text-sm font-normal'>Work Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     
                       <SelectItem value="on-site">On Site</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="intership">Intership</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>

             <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-normal'>Company Name</FormLabel>
                  <FormControl className='tex-slate-400'>
                    <Input placeholder="Company Name" {...field} className='w-full h-auto text-sm '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className='flex justify-end'>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </div>
  )
}

export default FormCreate