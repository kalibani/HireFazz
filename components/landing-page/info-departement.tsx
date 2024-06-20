'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import talent from '@/public/image/talent-acquisition.png';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const InfoDepartement = () => {
  const [position, setPosition] = useState(titleButton[0]);
  return (
    <div className="space-y-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-6">
          {titleButton.map((item) => (
            <Button
              onClick={() => setPosition(item)}
              variant={item.id !== position.id ? 'outline' : 'default'}
              className={cn(
                'h-auto py-4 font-normal transition-all delay-100 ease-in-out [font-size:_clamp(14px,10vw,18px)]  hover:bg-primary hover:font-normal hover:text-white',
                item.id !== position.id && 'border-primary font-light'
              )}
              key={item.id}
            >
              {item.btn}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="border-primar w-full  items-center overflow-hidden rounded-md border bg-[#F7FAFC] p-4 transition-transform  delay-300 ease-in-out md:px-10 md:py-9">
        <div className="flex flex-col-reverse gap-x-4 gap-y-4 lg:flex-row">
          <div className="flex w-full flex-col gap-y-4 lg:w-1/2 ">
            <h4 className="font-medium lg:text-xl xl:text-3xl">
              {position.title}
            </h4>
            <p className="text-sm text-second-text xl:text-lg">
              {position.content}
            </p>
            <div className="flex gap-x-4">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="w-16 rounded-full xl:w-20"
                  width={20}
                  height={20}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium md:text-base xl:text-lg">
                  {position.name}
                </p>
                <p className="max-w-[500px] text-xs font-light md:text-sm xl:text-base">
                  {position.testimonial}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 ">
            <Image alt="picture" src={talent} sizes="100%" quality={60} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDepartement;

const titleButton = [
  {
    btn: 'Talent Acquisition',
    title: 'Checking CV so much easier now',
    id: 1,
    content:
      'Our automated CV screening tool eliminates the need for tedious and repetitive tasks, allowing you to devote more time to strategic hiring decisions. Free up your schedule and streamline your recruitment process with our time-saving solution.',
    name: 'Jon Doe, Gojek',
    testimonial:
      'Berrylabs has revolutionized our tech recruitment by transforming our hiring process from taking weeks to mere days, making it a complete game-changer.',
  },
  {
    btn: 'Human resources',
    title: 'Human resources',
    id: 2,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at magna sit amet urna facilisis ullamcorper. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor.',
  },
  {
    btn: 'Job Platform Company',
    title: 'Job Platform Company',
    id: 3,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at magna sit amet urna facilisis ullamcorper. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor.',
  },
];
