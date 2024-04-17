'use client';
import React, { useEffect, useReducer, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';

const initialState = {
  jobDescription: '',
  skill: '',
  responsibilities: '',
  requirement: '',
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CHANGE_VALUE':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const CreateJobDetail = () => {
  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listOfEditor, setListOfEditor] = useState<string[]>(['']);

  useEffect(() => {
    if (listOfEditor) {
      console.log(listOfEditor.join(''));
      setValue(listOfEditor.join(''));
    }
  }, [listOfEditor]);

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'CHANGE_VALUE', field, value });
  };

  const addToEditor = (
    type: 'jobDescription' | 'skill' | 'responsibilities' | 'requirement',
  ) => {
    if (type === 'jobDescription') {
      const htmlDescription = `<p><strong>Job Description :</strong></p><p>${state[type]}</p><br/>`;
      setListOfEditor((prev) => {
        const newListOfEditor = [...prev];
        newListOfEditor[0] = htmlDescription;
        return newListOfEditor;
      });
    }
    if (type === 'skill') {
      const htmlDescription = `<p><strong>Skill :</strong></p><p>${state[type]}</p><br/>`;
      setListOfEditor((prev) => {
        const newListOfEditor = [...prev];
        newListOfEditor[1] = htmlDescription;
        return newListOfEditor;
      });
    }
    if (type === 'requirement') {
      const htmlDescription = `<p><strong>Requirement :</strong></p><p>${state[type]}</p><br/>`;
      setListOfEditor((prev) => {
        const newListOfEditor = [...prev];
        newListOfEditor[3] = htmlDescription;
        return newListOfEditor;
      });
    }
    if (type === 'responsibilities') {
      const htmlDescription = `<p><strong>Responsibilities :</strong></p><p>${state[type]}</p><br/>`;
      setListOfEditor((prev) => {
        const newListOfEditor = [...prev];
        newListOfEditor[2] = htmlDescription;
        return newListOfEditor;
      });
    }
  };

  return (
    <div className="w-ful flex flex-col items-center justify-center overflow-y-auto rounded-md bg-white px-12 py-8">
      <h3 className="mb-12 text-center text-2xl font-semibold">
        Create Job Details
      </h3>
      <div className="flex w-full gap-x-3">
        <div className="h-[530px] w-[445px] space-y-2 overflow-y-auto">
          <div className="overflow-hidden rounded-md  border">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <span>
                  <Info className="h-6 w-6 text-green-600" />
                </span>
                <p className="text-sm font-normal text-second-text">
                  Directly Paste your Job Description here or create new with
                  our AI generated suggestions
                </p>
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-slate-200 p-2">
                <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                  Job Description
                </AccordionTrigger>
                <AccordionContent className="">
                  <Textarea
                    minRows={10}
                    className="focus-visible:ring-0 focus-visible:ring-transparent"
                    value={state.jobDescription}
                    onChange={(e) =>
                      handleChange('jobDescription', e.target.value)
                    }
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                    >
                      {' '}
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                      onClick={() => addToEditor('jobDescription')}
                    >
                      Add to Editor <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="overflow-hidden rounded-md  border">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-slate-200 p-2">
                <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                  Skill
                </AccordionTrigger>
                <AccordionContent className="">
                  <Textarea
                    minRows={10}
                    className="focus-visible:ring-0 focus-visible:ring-transparent"
                    onChange={(e) => handleChange('skill', e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                      onClick={() => addToEditor('skill')}
                    >
                      Add to Editor <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="overflow-hidden rounded-md  border">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-slate-200 p-2">
                <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                  Responsibilities
                </AccordionTrigger>
                <AccordionContent className="">
                  <Textarea
                    minRows={10}
                    className="focus-visible:ring-0 focus-visible:ring-transparent"
                    onChange={(e) =>
                      handleChange('responsibilities', e.target.value)
                    }
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                    >
                      {' '}
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                      onClick={() => addToEditor('responsibilities')}
                    >
                      Add to Editor <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="overflow-hidden rounded-md  border">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-slate-200 p-2">
                <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                  Requirement
                </AccordionTrigger>
                <AccordionContent className="">
                  <Textarea
                    minRows={10}
                    className="focus-visible:ring-0 focus-visible:ring-transparent"
                    onChange={(e) =>
                      handleChange('requirement', e.target.value)
                    }
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                    >
                      {' '}
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                      onClick={() => addToEditor('requirement')}
                    >
                      Add to Editor <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="h-[530px] w-[742px] rounded-md bg-white">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              className="h-[485px] border-none"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" className="min-w-32">
              Previous
            </Button>
            <Button
              className="min-w-32"
              disabled={!value}
              onClick={() => console.log('done')}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobDetail;
