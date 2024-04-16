'use client'

import React, { useState } from 'react'
import FormCreate, {type formSchemaCreateJob } from './form-create'
import { z } from 'zod'
import TrackingStep from './tracking-step'
import CreateJobDetail from './create-job-detail'

const CreateStep = () => {
  const [step, setStep] = useState(1)

   const onSubmit = (values: z.infer<typeof formSchemaCreateJob>) => {
    console.log(values, "dari form <<<")
    setStep(prev=> prev+1)
  }

  return (
    <div className='space-y-3'>
      <TrackingStep step={step}/>
      <div className='flex flex-col w-full bg-white items-center py-8 rounded-md  min-h-svh'>
        {step === 0 && 
          <FormCreate onSubmit={(values)=>onSubmit(values)} />
        }
        {
          step === 1 && <CreateJobDetail/>
        }
      </div>
    </div>
  )
}

export default CreateStep