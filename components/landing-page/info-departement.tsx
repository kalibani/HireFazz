'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import talent from '@/public/image/talent-acquisition.png';
import Image from 'next/image';

const InfoDepartement = () => {
  const [position, setPosition] = useState(titleButton[0]);
  return (
    <div className="space-y-6">
      <div className="w-full space-x-6">
        {titleButton.map((item) => (
          <Button
            onClick={() => setPosition(item)}
            variant={item.id !== position.id ? 'outline' : 'default'}
            className={cn(
              'min-h-[84px] min-w-[300px] text-2xl font-medium transition-all delay-100 ease-in-out hover:bg-primary hover:font-medium hover:text-white ',
              item.id !== position.id && 'border-primary font-light'
            )}
            key={item.id}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div className="border-primar flex w-full items-center overflow-hidden border  bg-[#F7FAFC]  px-10 py-9 transition-transform delay-300 ease-in-out">
        <div className="relative z-10 flex gap-x-4">
          <div className="flex w-1/2 flex-col gap-y-4">
            <h4 className="text-3xl font-medium">{position.title}</h4>
            <p>{position.content}</p>
            <div className="flex gap-x-4">
              <div className="h-20 w-20 rounded-full bg-gray-400"></div>
              <div>
                <p className="text-lg font-medium">{position.name}</p>
                <p className="max-w-[400px] font-light">
                  {position.testimonial}
                </p>
              </div>
            </div>
          </div>
          <div className="w-1/2 ">
            <div className="h-[277px] w-[552px]">
              <Image alt="picture" src={talent} sizes="100%" quality={60} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDepartement;

const titleButton = [
  {
    title: 'Checking CV so much easier now',
    id: 1,
    content:
      'Our automated CV screening tool eliminates the need for tedious and repetitive tasks, allowing you to devote more time to strategic hiring decisions. Free up your schedule and streamline your recruitment process with our time-saving solution.',
    name: 'Jon Doe, Gojek',
    testimonial:
      'Berrylabs has revolutionized our tech recruitment by transforming our hiring process from taking weeks to mere days, making it a complete game-changer.',
  },
  {
    title: 'Human resources',
    id: 2,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at magna sit amet urna facilisis ullamcorper. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor.',
  },
  {
    title: 'Job Platform Company',
    id: 3,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at magna sit amet urna facilisis ullamcorper. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac vitae dolor.',
  },
];
