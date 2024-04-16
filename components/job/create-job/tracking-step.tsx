import { cn } from '@/lib/utils'
import React from 'react'

const TrackingStep = ({step}:{step:number}) => {
  return (
      <div className='flex items-center justify-center bg-white text-xs capitalize gap-x-2 rounded-md py-8'>
        <p>Create New Job</p>
        <div className='flex items-center justify-center'>
          <div className='w-5 h-5 rounded-full bg-red-600' />
          <div className={cn('bg-gray-200 h-[6px] w-80 transition-all duration-300 bg-gradient-to-r from-red-600 via-gray-200', step === 1 && ' bg-gradient-to-r from-red-600 via-red-600 to-red-600')} />
          <div className={cn('bg-gray-200 w-5 h-5 rounded-full transition-all duration-300', step === 1 && 'bg-red-600')} />
        </div>
        <p>Job Detais</p>
      </div>
  )
}

export default TrackingStep