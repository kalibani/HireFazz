import { Video } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import Logo from '@/public/icons/logo.svg';

interface WrapperQuestionProps {
  videoContent: ReactNode;
  mainContent: ReactNode;
}

const WrapperQuestion: React.FC<WrapperQuestionProps> = ({
  videoContent,
  mainContent,
}) => {
  return (
    <div className="flex max-w-full flex-col overflow-hidden rounded-lg shadow-md md:min-w-[800px] md:max-w-6xl md:flex-row">
      <div className="w-full bg-primary p-6 md:w-1/2">
        <Image src={Logo} alt="logo" width={100} className="mb-4" />
        <div className="flex items-center gap-x-2 text-xs text-white">
          <Video className="size-4" />
          <p>Intro</p>
        </div>
        {videoContent}
      </div>
      <div className="w-full flex-col justify-center p-6 md:w-1/2">
        {mainContent}
      </div>
    </div>
  );
};

export default WrapperQuestion;
