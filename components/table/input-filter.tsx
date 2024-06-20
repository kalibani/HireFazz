'use client';
import React, { useState } from 'react';

import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

interface InputFilterProps extends Partial<HTMLInputElement> {
    label: string
    onChange?: (value: string) => void
    value?: string
}

const InputFilter = ({ label, placeholder, value, onChange }: InputFilterProps) => {
  return (
    <div>
    <span className="text-sm">{label}</span>
      <div className="border rounded-md px-2 py-2 divide-y bg-white/80 backdrop-blur-md flex gap-2 items-center w-fit">
        <SearchIcon />
          <Input
            name="search"
            className="w-full border-none ring-0 outline-none focus-visible:ring-0 text-sm p-0 h-fit bg-transparent"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            width={182}
          />

      </div>
    </div>
  );
};

export default InputFilter;
