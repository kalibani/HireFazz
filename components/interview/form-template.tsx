'use client';
import React from 'react';
import { Input } from '../ui/input';

const FormTemplate = () => {
  return (
    <div className="mt-5">
      <div>
        <label className="text-sm font-normal">Name Template</label>
        <Input />
      </div>
    </div>
  );
};

export default FormTemplate;
