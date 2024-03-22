import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { WrapperSection } from '.';

const CommingSoon = () => {
  return (
    <WrapperSection className="flex h-screen flex-col items-center justify-center gap-y-12 ">
      <h1 className="text-6xl font-semibold">Great things Comming Soon !</h1>
      <p className="text-2xl">
        We’re ready to build something new and more effecient to solving your
        repetitive task.
      </p>
      <div className="flex w-full justify-center gap-x-4">
        <Input
          className="max-w-[288px]"
          inputMode="email"
          placeholder="email"
        />
        <Button className="h-auto" variant="default">
          Notify Me
        </Button>
      </div>
      <p className="text-2xl">Notify me when Feature is launched :)</p>
    </WrapperSection>
  );
};

export default CommingSoon;
