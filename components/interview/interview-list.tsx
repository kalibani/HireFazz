'use client';

import React from 'react';
import { Button } from '../ui/button';

const InterviewList = ({ title }: { title: string }) => {
  return (
    <div className="my-4 w-full rounded-lg border p-4 shadow">
      <h4 className="text-lg font-bold">{title}</h4>
      <Button className="mr-4">Delete</Button>
      <Button>Edit</Button>
    </div>
  );
};

export default InterviewList;
