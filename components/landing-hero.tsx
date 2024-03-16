'use client';

import TypewriterComponent from 'typewriter-effect';

import { Button } from '@/components/ui/button';

export const LandingHero = () => {
  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Best AI Tool for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-600">
          <TypewriterComponent
            options={{
              strings: [
                'Automatic CV Screener',
                'Bank Statement Analyzer',
                'Invoice Reviewer',
                'Loan Application Processor',
                'Regulatory Auditor',
                'Contract Checker',
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-white">
        Empower Your Workflow with AI Precision
      </div>
      <div>
        {/* <Link href={isSignedIn ? "/dashboard" : "/sign-up"}> */}
        <Button
          variant="premium2"
          className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
        >
          Start Generating For Free
        </Button>
        {/* </Link> */}
      </div>
      <div className="text-white text-base md:text-base font-normal">
        Transform Your Repetitive Tasks into Effortless Actions!
      </div>
    </div>
  );
};
