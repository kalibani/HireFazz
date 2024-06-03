import getCandidate from '@/lib/actions/candidate/getCandidate';
import React, { FC } from 'react';
import InvalidCandidate from './invalid-candidates';
import Logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import { Video } from 'lucide-react';

interface Iintro {
  videoUrl: string;
  description: string;
  templateName: string;
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

    return (
      <div className="flex w-fit overflow-hidden rounded-lg shadow-md">
        <div className="flex w-1/2 flex-col bg-primary p-6">
          <Image src={Logo} alt="logo" width={100} className="mb-4" />
          <div className="flex items-center gap-x-2 text-xs text-white">
            <Video className="size-4" />
            <p>Intro</p>
          </div>
          <div className=" aspect-video h-64 overflow-hidden rounded-md border">
            <video
              controls
              className="inset-0 aspect-video h-full w-full"
              style={{ objectFit: 'cover' }}
            >
              <source src={intro?.videoUrl} />
            </video>
          </div>
        </div>
        <div className="w-1/2 p-6">
          <div>Logo</div>
          <div className="h-64 w-96 rounded-md border">video</div>
        </div>
      </div>
    );
  }
  return <InvalidCandidate />;
};

export default Questions;
