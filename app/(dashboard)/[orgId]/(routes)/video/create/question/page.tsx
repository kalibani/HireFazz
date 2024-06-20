import FormQuestion from '@/components/interview/form-question';
import React from 'react';

const page = () => {
  return (
    <>
      <div className="rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">Create Questions</h3>
        <p className="text-sm font-normal text-slate-400">
          Add detail question here
        </p>
      </div>
      <FormQuestion />
    </>
  );
};

export default page;
