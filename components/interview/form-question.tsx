'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2, FilePlus2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRecorderStore } from '@/zustand/recordedStore';

const FormQuestion = () => {
  const [newText, setNewText] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submit here
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        
      </form>
    </>
  );
};

export default FormQuestion;


// domain/ijfjdjkskjsjfks 