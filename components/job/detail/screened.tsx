'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { PaginationGroup } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ANALYSYS_STATUS } from '@prisma/client'
import { CheckedState } from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { Flag, MapPinIcon, BotIcon, ChevronDown, Search, FileSearchIcon, Info } from 'lucide-react'
import React, { FC } from 'react'

// Only slicing with mock example
const DetailJobScreened = () => {
  const actionList = [
    ANALYSYS_STATUS.SHORTLISTED,
    ANALYSYS_STATUS.REJECTED,
    ANALYSYS_STATUS.INTERVIEW,
    'DELETE',
    'Send Email'
  ]
  // Adjust filter in integration
  const filterBy = [
    'Name'
  ]

  const totalItems = 5
  const jobName = 'Software Engineer'
  return (
    <div className="mt-5 flex flex-col gap-3">

      <div className="flex justify-between min-h-20">
        <div>
          <div className="flex items-center gap-2">
            <FileSearchIcon className="text-red-500 size-4" />
            <p className="text-sm">
              There {totalItems > 1 ? 'are' : 'is'} <b>{totalItems} applicants</b> on{' '}
              <b>
                “{jobName}”
              </b>
            </p>
          </div>

          <span className="pl-6 mt-4 text-sm block">
            Status: <span className="text-blue-700">3/5 Analyzing...</span>
          </span>
        </div>


        <Button className="mt-auto">
          + Add to Shortlisted
        </Button>
      </div>

      {/* FILTERS */}
      <div className="border border-slate-200 rounded-md px-2 py-3 flex gap-3 justify-between">
        <div className="flex gap-1 items-center mr-3">
          <Checkbox
            aria-label="Select all"
            className="border-slate-400 bg-white text-black"
          />
          <ChevronDown className="size-4" />

          <div className="flex gap-2 items-center ml-4">
            <Select>
              <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
                <SelectValue placeholder="Shortlisted" defaultValue="SHORTLISTED" />
              </SelectTrigger>


              <SelectContent>
                {actionList.map((action) => <SelectItem key={action} value={action} className="capitalize">{action.toLowerCase()}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              className="text-xs h-[30px] px-2"
            >
              Action
            </Button>
          </div>
        </div>

        <div className="max-w-[200px] flex gap-1 items-center border border-slate-300 rounded-sm px-3 h-[28px]">
          <input placeholder="Search Location" className="text-sm outline-none w-28" />
          <Search className="text-slate-300 size-4 shrink-0" />
        </div>


        <div className="flex gap-2 items-center">
          <label className="text-sm">Sort by</label>
          <Select>
            <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
              <SelectValue placeholder="Name" defaultValue="Name" />
            </SelectTrigger>

            <SelectContent>
              {filterBy.map((action) => <SelectItem key={action} value={action} className="capitalize">{action.toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm">Filter by score</label>

          <Slider className="w-[170px]" min={0} max={100} defaultValue={[80]} />
        </div>
      </div>

      <ScreenedItem
        isChecked={false}
        flag="high"
        score="80%"
        name="Angel Herwitz"
        skills="Code Ninja (Java, Python, etc.) - Design Mastermind (Scalable Systems) - Debugging Detective - Git"
        location="Jakarta"
        education="Bachelor of Computer"
        experience="3 Years"
        description="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book 123123"
      />
      <ScreenedItem
        isChecked={false}
        flag="low"
        score="50%"
        name="Angel Herwitz"
        skills="Code Ninja (Java, Python, etc.) - Design Mastermind (Scalable Systems) - Debugging Detective - Git"
        location="Jakarta"
        education="Bachelor of Computer"
        experience="3 Years"
        description="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book 123123"
      />
      <ScreenedItem
        isChecked={false}
        flag="high"
        score="80%"
        name="Angel Herwitz"
        skills="Code Ninja (Java, Python, etc.) - Design Mastermind (Scalable Systems) - Debugging Detective - Git"
        location="Jakarta"
        education="Bachelor of Computer"
        experience="3 Years"
        description="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book 123123"
      />

      <PaginationGroup
        totalItems={3}
        perPage={10}

      />
    </div>
  )
}

export default DetailJobScreened

interface ScreenedItemProps {
  isChecked?: boolean
  handleCheck?: (id: CheckedState) => void
  flag?: 'high' | 'low'
  score: string
  name: string
  description: string
  education: string
  experience: string
  skills: string
  location: string

}

const ScreenedItem: FC<ScreenedItemProps> = ({
  isChecked,
  handleCheck,
  flag,
  score,
  description,
  name,
  education,
  experience,
  skills,
  location
}) => {
  return (
    <div className="w-full border rounded-md overflow-hidden border-slate-300">
      <div className="flex gap-2">
        <Checkbox className="mt-4 ml-2" />

        <div className="flex-1 py-3">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <h3 className="font-semibold text-xl leading-tight">{name}</h3>
              <div className={clsx(
                'flex items-center gap-1 text-xs',
                {
                  'text-green-600': flag === 'high',
                  'text-red-600': flag === 'low',
                }
              )}>
                <Flag className="size-[14px]" />
                <span>{flag === 'high' ? 'High Candidates' : 'Low Candidates'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <MapPinIcon className="size-[14px]" />
              <span className="text-sm">{location}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <div className="bg-rose-600 size-8 flex justify-center items-center shrink-0 rounded-sm">
              <BotIcon className="size-[18px] text-white" />
            </div>

            <p className="text-xs font-medium text-slate-500">
              {description.length > 250 ? (
                <>
                  {description.trim().slice(0, 249).trim() + '...'}
                  <Info className="inline-block size-[14px] text-blue-800" />
                </>
              ) : description}
            </p>

          </div>
        </div>

        <div className="flex flex-col justify-center w-[76px] bg-slate-200 px-4 py-2 border-slate-300 border-l">
          <span className="text-sm">Score</span>
          <span className="font-semibold text-lg">{score}</span>
          <span className="text-sm">Match</span>
        </div>
      </div>


      <div className="w-full bg-slate-100 min-h-16 flex justify-between items-center px-5 py-2 gap-2 border-slate-300 border-t">
        <div>
          <div className="flex gap-2 items-center">
            <div className="bg-white rounded-sm border text-slate-500 w-fit px-2 py-1 text-xs">Experience: {experience}</div>
            <div className="bg-white rounded-sm border text-slate-500 w-fit px-2 py-1 text-xs">Education: {education}</div>
          </div>

          <div className="bg-white rounded-sm border mt-2 w-fit px-2 py-1 text-xs">
            Skills: {skills}
          </div>
        </div>

        <Button className="text-xs p-2 h-fit">
          <span>View CV</span>
        </Button>

      </div>

    </div>
  )
}
