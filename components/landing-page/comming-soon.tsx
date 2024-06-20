import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { WrapperSection } from '.';

const CommingSoon = () => {
  return (
    <WrapperSection className="flex h-screen flex-col items-center justify-center  gap-y-9 lg:gap-y-12 ">
      <h1 className="text-center text-5xl font-semibold lg:text-6xl">
        Great things Comming Soon !
      </h1>
      <p className="px-3 text-center text-lg lg:text-2xl">
        We’re ready to build something new and more effecient to solving your
        repetitive task.
      </p>
      <div className="flex w-full justify-center gap-x-2 px-3 lg:gap-x-4">
        <Input
          className="w-1/2 md:max-w-[288px]"
          inputMode="email"
          placeholder="email"
        />
        <Button className="h-auto" variant="default">
          Notify Me
        </Button>
      </div>
      <p className="text-center text-lg lg:text-2xl">
        Notify me when Feature is launched :)
      </p>
    </WrapperSection>
  );
};

export default CommingSoon;
