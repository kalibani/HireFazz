import React, { FC } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'


interface BannerProps {
  src:string
  title:string
  desc:string
  btnTitle:string
}

const Banner:FC<BannerProps> = ({src, title, desc, btnTitle}) => {
  return (
     <div className="bg-gradient-to-r from-rose-600 via-[#A24688] to-[#4E3ABA] py-4 px-11 flex items-center rounded-lg justify-between">
      <div className="flex flex-col gap-y-4 text-white">
        <h1 className="font-semibold text-3xl">{title}</h1>
        <p className="text-sm max-w-[883px]">
         {desc}
        </p>
        <Button className="w-fit text-sm font-medium" variant="secondary">{btnTitle}</Button>
      </div>
        <Image alt="icon" src={src}/>
      </div>
  )
}

export default Banner