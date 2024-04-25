'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2, FilePlus2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRecorderStore } from '@/zustand/recordedStore';

const FormQuestion = () => {
  const [newText, setNewText] = useState('');
  const { texts, addText, updateText, removeText } = useRecorderStore();

  const handleAddText = () => {
    addText(newText);

    setNewText('');
  };

  const handleTextChange = (index: number, value: string) => {
    updateText(index, value);
  };

  const handleRemoveText = (index: number) => {
    removeText(index);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(texts, '<< submit');
    // Handle form submit here
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {texts.length > 0 &&
            texts.map((text, index) => (
              <div key={index} className="mb-3 flex items-center gap-x-3">
                <Textarea
                  className="w-full rounded-lg"
                  value={text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  disabled
                />
                <Button type="button" onClick={() => handleRemoveText(index)}>
                  <Trash2 className="w-4" />
                </Button>
              </div>
            ))}
          <Textarea
            className="w-full rounded-lg"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button type="button" onClick={handleAddText}>
            <FilePlus2 className="mr-2 w-4" />
            Add Question
          </Button>
          <Button
            type="submit"
            disabled={texts.length === 0 || texts[0].trim() === ''}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormQuestion;
