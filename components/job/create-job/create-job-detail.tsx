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

// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { useFormStepStore } from '@/zustand/useCreateJob';
import {
  generateRequirement,
  generateResponsibilities,
  generateSkill,
  genereteJobDescription,
} from '@/lib/actions/generate/actionGenerate';
import dynamic from 'next/dynamic';
import { Loader } from '@/components/share';

const ReactQuill = dynamic(
  () => import('react-quill'),

  { ssr: false },
);

const initialState = {
  jobDescription: '',
  skill: [],
  responsibilities: '',
  requirement: '',
};

const dataAccordion: dataAccordionType[] = [
  { name: 'Skill', type: 'skill' },
  { name: 'Responsibilities', type: 'responsibilities' },
  { name: 'Requirement', type: 'requirement' },
];

type dataAccordionType = {
  name: string;
  type: 'skill' | 'responsibilities' | 'requirement';
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CHANGE_VALUE':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

type AutoGenerateType = 'jobDescription' | 'skill' | 'responsibilities' | 'requirement'

const headerMap: Record<AutoGenerateType, string> = {
  jobDescription: 'Job Summary',
  skill: 'Skill',
  responsibilities: 'Responsibilites',
  requirement: 'Requirements',
}

const CreateJobDetail = () => {
  const { setStep, setFormDetailJob, dataCreateJob } = useFormStepStore(
    (state) => state,
  );

  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listOfEditor, setListOfEditor] = useState<string[]>(['']);
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    const genrate = () => {
      startTransition(async () => {
        const { result } = await genereteJobDescription(dataCreateJob);
        handleChange('jobDescription', result);
      });
    };
    if (mount) {
      genrate();
    }
  }, [mount]);

  useEffect(() => {
    if (listOfEditor) {
      setValue(listOfEditor.join(''));
    }
  }, [listOfEditor]);

  const handleChange = (field: string, value: string | string[]) => {
    dispatch({ type: 'CHANGE_VALUE', field, value });
  };

  const [isPending, startTransition] = useTransition();
  const autoGenerate = async (
    type: AutoGenerateType,
  ) => {
    startTransition(async () => {
      switch (type) {
        case 'skill':
          const { result: skillResult } = await generateSkill(
            dataCreateJob.title,
          );
          let skillSet: string[] = []

          // skill result can either be: string, array, object
          // modify if there is new case
          if (typeof skillResult === 'string') {
            skillSet = skillResult.split(',')
          } else if (typeof skillResult === 'object' && Array.isArray(skillResult)) {
            skillSet = skillResult
          } else if (typeof skillResult === 'object') {
            skillSet = Object.values(skillResult).flat() as string[]
          }
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
    type: AutoGenerateType,
  ) => {
    const htmlDescription = `<p><strong>${headerMap[type]} :</strong></p><p>${state[type]}</p><br/>`;
    setListOfEditor((prev) => {
      const newListOfEditor = [...prev];
      switch (type) {
        case 'jobDescription':
          newListOfEditor[0] = htmlDescription;
          break;
        case 'skill':
          // add space after comma
          const skillHtml = `<p><strong>${headerMap[type]} :</strong></p><p>${state[type].join(', ')}</p><br/>`;
          newListOfEditor[1] = skillHtml;
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
  const prevStep = () => {
    setFormDetailJob(value);
    setStep(0);
  };

  if (!mount) {
    return <Loader />;
  }

  const getContent = (type: AutoGenerateType) => {
    if (type === 'skill') {
      return (
        <div className="w-full bg-white min-h-[218px] rounded-sm p-2 flex flex-wrap gap-3">
          {!state[type].length ? (
            <span>Click Generate button</span>
          ) : (
            state[type]?.flat().map((skillItem: string, idx: number) => (
              <span key={skillItem + idx} className="py-1 rounded-sm px-2 bg-slate-500 text-white h-8 flex items-center">
                {skillItem.trim()}
              </span>
            ))
          )}
        </div>
      )
    }

    return (
      <Textarea
        value={state[type]}
        placeholder={
          isPending ? 'loading' : 'Click Generate button'
        }
        minRows={10}
        className="focus-visible:ring-0 focus-visible:ring-transparent"
        onChange={(e) => handleChange(type, e.target.value)}
      />
    )
  }

  return (
    <div className="flex overflow-y-scroll flex-1 w-full flex-col items-center rounded-md bg-white  py-8">
      <div className="w-ful flex flex-col items-center justify-center overflow-y-auto px-12 py-8">
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
                  <AccordionTrigger className="h-auto p-0 text-sm font-normal py-2 hover:no-underline">
                    Job Summary
                  </AccordionTrigger>
                  <AccordionContent>
                    {isPending ? (
                      <DescriptionSkeleton />
                    ) : (
                      <Textarea
                        minRows={10}
                        className="focus-visible:ring-0 focus-visible:ring-transparent"
                        value={state.jobDescription}
                        onChange={(e) =>
                          handleChange('jobDescription', e.target.value)
                        }
                      />
                    )}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                        onClick={() => autoGenerate('jobDescription')}
                        disabled={isPending}
                      >
                        {' '}
                        Regenerate
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                        onClick={() => addToEditor('jobDescription')}
                        disabled={isPending}
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
                    <AccordionTrigger className="h-auto py-2 text-sm font-normal hover:no-underline">
                      {name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {isPending ? (
                        <DescriptionSkeleton />
                      ) : (
                        getContent(type)
                      )}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                          onClick={() => autoGenerate(type)}
                          disabled={isPending}
                        >
                          Regenerate
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                          onClick={() => addToEditor(type)}
                          disabled={isPending}
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
                //@ts-ignore
                theme="snow"
                value={value}
                onChange={setValue}
                className="h-[485px] border-none"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="min-w-32" onClick={prevStep}>
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

const DescriptionSkeleton = () => {
  return (
    <ul className="space-y-3 bg-white px-2 py-3 h-[218px] rounded-sm">
      <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700 animate-pulse"></li>
      <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700 animate-pulse "></li>
      <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700 animate-pulse "></li>
      <li className="w-1/2 h-4 bg-gray-200 rounded-full dark:bg-neutral-700 animate-pulse "></li>
    </ul>
  )
}