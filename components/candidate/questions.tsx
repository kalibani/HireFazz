import getCandidate from '@/lib/actions/candidate/getCandidate';
import React, { FC } from 'react';
import InvalidCandidate from './invalid-candidates';
import Logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import { Video, MessagesSquare, ClipboardList } from 'lucide-react';

interface Iintro {
  videoUrl: string;
  description: string;
  templateName: string;
  name: string;
}
interface Iquestions {
  id: string;
  title: string;
  question: string;
  timeRead: number;
  videoUrl: string;
  timeAnswered: number;
  questionRetake: number;
}
const Questions: FC<{ id: string }> = async ({ id }) => {
  const candidate = await getCandidate(id);
  if (candidate && typeof candidate === 'object') {
    const intro = (candidate as { intro?: Iintro })?.intro;
    const questions = (candidate as { questions?: Iquestions[] })?.questions;
    console.log({ intro });
    return (
      <div className="flex w-fit overflow-hidden rounded-lg shadow-md">
        <div className="flex  w-[500px] flex-col bg-primary p-6">
          <Image src={Logo} alt="logo" width={100} className="mb-4" />
          <div className="flex items-center gap-x-2 text-xs text-white">
            <Video className="size-4" />
            <p>Intro</p>
          </div>
          <div className=" aspect-video h-64 overflow-hidden rounded-xl border">
            <video
              controls
              className="inset-0 aspect-video h-full w-full"
              style={{ objectFit: 'cover' }}
            >
              <source src={intro?.videoUrl} />
            </video>
          </div>
        </div>
        <div className="flex w-[500px]  flex-col justify-center p-6">
          <h4 className="my-5 flex items-center gap-x-2 text-left text-xl font-semibold text-primary">
            <MessagesSquare className="size-5" /> Welcome to {intro?.name}
          </h4>
          <p className="max-w-xs ">Welcome to Our Online Video Interview</p>
          <p className="my-6 text-xs">
            This Interview has been designed to measrue some key attributes that
            are important for success within our organisation.
          </p>
          <p className="text-xs">
            Please to ensure you are in a quiet environment so that you can
            complete the interview with no interuptions.
          </p>

          <h4 className="mt-5 flex items-center gap-x-2 text-left text-xl font-semibold text-primary">
            <ClipboardList className="size-5" /> Need to be prepared.
          </h4>
          <ul className="mb-8 list-item text-sm">
            <li>Good internet conecction</li>
            <li>Good webcam</li>
            <li>Clear voice mic</li>
            <li>Good lighting</li>
          </ul>
        </div>
      </div>
    );
  }
  return <InvalidCandidate />;
};

export default Questions;
