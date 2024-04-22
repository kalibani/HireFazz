'use client';
import React, { useEffect, useReducer, useState, useTransition } from 'react';
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
import { useFormStepStore } from '@/zustand/useCreateJob';
import {
  generateRequirement,
  generateResponsibilities,
  generateSkill,
  genereteJobDescription,
} from '@/lib/actions/job/createJob';

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
  const { setStep, setFormDetailJob, dataCreateJob } = useFormStepStore(
    (state) => state,
  );

  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listOfEditor, setListOfEditor] = useState<string[]>(['']);

  useEffect(() => {
    const genrate = async () => {
      startTransition(async () => {
        const { result } = await genereteJobDescription(dataCreateJob);
        handleChange('jobDescription', result);
      });
    };

    genrate();
  }, []);

  useEffect(() => {
    if (listOfEditor) {
      setValue(listOfEditor.join(''));
    }
  }, [listOfEditor]);

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'CHANGE_VALUE', field, value });
  };

  const [isPending, startTransition] = useTransition();
  const autoGenerate = async (
    type: 'jobDescription' | 'skill' | 'responsibilities' | 'requirement',
  ) => {
    startTransition(async () => {
      switch (type) {
        case 'skill':
          const { result: skillResult } = await generateSkill(
            dataCreateJob.title,
          );
          const skillSet = skillResult.skills?.length
            ? skillResult.skills?.join(', ')
            : skillResult;
          handleChange('skill', skillSet);
          break;
        case 'responsibilities':
          const { result: responsibilitiesResult } =
            await generateResponsibilities(dataCreateJob);
          handleChange('responsibilities', responsibilitiesResult);
          break;
        case 'requirement':
          const { result: requirementResult } =
            await generateRequirement(dataCreateJob);
          handleChange('requirement', requirementResult);
          break;
        case 'jobDescription':
          const { result: jobDescriptionResult } =
            await genereteJobDescription(dataCreateJob);
          handleChange('jobDescription', jobDescriptionResult);
          break;
        default:
          break;
      }
    });
  };

  const addToEditor = (
    type: 'jobDescription' | 'skill' | 'responsibilities' | 'requirement',
  ) => {
    const htmlDescription = `<p><strong>${type.charAt(0).toUpperCase() + type.slice(1)} :</strong></p><p>${state[type]}</p><br/>`;
    setListOfEditor((prev) => {
      const newListOfEditor = [...prev];
      switch (type) {
        case 'jobDescription':
          newListOfEditor[0] = htmlDescription;
          break;
        case 'skill':
          newListOfEditor[1] = htmlDescription;
          break;
        case 'responsibilities':
          newListOfEditor[2] = htmlDescription;
          break;
        case 'requirement':
          newListOfEditor[3] = htmlDescription;
          break;
        default:
          break;
      }
      return newListOfEditor;
    });
  };

  const nextStep = () => {
    setFormDetailJob(value);
    setStep(2);
  };

  return (
    <div className="flex min-h-svh w-full flex-col items-center rounded-md bg-white  py-8">
      <div className="w-ful flex flex-col items-center justify-center overflow-y-auto px-12 py-8">
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
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1" className="bg-slate-200 p-2">
                  <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                    Job Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      minRows={10}
                      className="focus-visible:ring-0 focus-visible:ring-transparent"
                      value={state.jobDescription}
                      placeholder={isPending ? 'loading' : ''}
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

            {dataAccordion.map(({ name, type }) => (
              <div className="overflow-hidden rounded-md  border" key={name}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={type} className="bg-slate-200 p-2">
                    <AccordionTrigger className="h-auto p-0 text-sm font-normal">
                      {name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        value={state[type]}
                        placeholder={
                          isPending ? 'loading' : 'Click Generate button'
                        }
                        minRows={10}
                        className="focus-visible:ring-0 focus-visible:ring-transparent"
                        onChange={(e) => handleChange(type, e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                          onClick={() => autoGenerate(type)}
                        >
                          Regenerate
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                          onClick={() => addToEditor(type)}
                        >
                          Add to Editor <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
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
              <Button className="min-w-32" disabled={!value} onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobDetail;

const dataAccordion: dataAccordionType[] = [
  { name: 'Skill', type: 'skill' },
  { name: 'Responsibilities', type: 'responsibilities' },
  { name: 'Requirement', type: 'requirement' },
];

type dataAccordionType = {
  name: string;
  type: 'skill' | 'responsibilities' | 'requirement';
};
