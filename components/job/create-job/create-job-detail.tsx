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

interface LoadingState {
  jobDescription?: boolean;
  skill?: boolean;
  responsibilities?: boolean;
  requirement?: boolean;
}

type AutoGenerateType =
  | 'jobDescription'
  | 'skill'
  | 'responsibilities'
  | 'requirement';

const headerMap: Record<AutoGenerateType, string> = {
  jobDescription: 'Job Summary',
  skill: 'Skill',
  responsibilities: 'Responsibilites',
  requirement: 'Requirements',
};

const CreateJobDetail = () => {
  const { setStep, setFormDetailJob, dataCreateJob } = useFormStepStore(
    (state) => state,
  );

  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listOfEditor, setListOfEditor] = useState<string[]>(['']);
  const [mount, setMount] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({});
  const { companyName, currency, experiences, location, title, workModel } =
    dataCreateJob;
  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    const genrate = () => {
      setLoadingState((value) => ({ ...value, jobDescription: true }));
      startTransition(async () => {
        const { result } = await genereteJobDescription(dataCreateJob);
        handleChange('jobDescription', result);
        setLoadingState((value) => ({ ...value, jobDescription: false }));
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
  const autoGenerate = async (type: AutoGenerateType) => {
    setLoadingState((value) => ({ ...value, [type]: true }));

    startTransition(async () => {
      switch (type) {
        case 'skill':
          const { result: skillResult } = await generateSkill(
            dataCreateJob.title,
          );
          let skillSet: string[] = [];

          // skill result can either be: string, array, object
          // modify if there is new case
          if (typeof skillResult === 'string') {
            skillSet = skillResult.split(',');
          } else if (
            typeof skillResult === 'object' &&
            Array.isArray(skillResult)
          ) {
            skillSet = skillResult;
          } else if (typeof skillResult === 'object') {
            skillSet = Object.values(skillResult).flat() as string[];
          }
          handleChange('skill', skillSet);
          setLoadingState((value) => ({ ...value, skill: false }));
          break;
        case 'responsibilities':
          const { result: responsibilitiesResult } =
            await generateResponsibilities(dataCreateJob);
          handleChange('responsibilities', responsibilitiesResult);
          setLoadingState((value) => ({ ...value, responsibilities: false }));
          break;
        case 'requirement':
          const { result: requirementResult } = await generateRequirement({
            title,
            experiences,
            location,
            workModel,
            companyName,
          });
          handleChange('requirement', requirementResult);
          setLoadingState((value) => ({ ...value, requirement: false }));
          break;
        case 'jobDescription':
          const { result: jobDescriptionResult } =
            await genereteJobDescription(dataCreateJob);
          handleChange('jobDescription', jobDescriptionResult);
          setLoadingState((value) => ({ ...value, jobDescription: false }));
          break;
        default:
          break;
      }
    });
  };

  const addToEditor = (type: AutoGenerateType) => {
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
        <div className="flex min-h-[218px] w-full flex-wrap gap-3 overflow-y-scroll rounded-sm bg-white p-2">
          {!state[type].length ? (
            <span>Click Generate button</span>
          ) : (
            state[type]?.flat().map((skillItem: string, idx: number) => (
              <span
                key={skillItem + idx}
                className="flex h-fit min-h-8 items-center rounded-sm bg-slate-500 px-2 py-1 text-white"
              >
                {skillItem.trim()}
              </span>
            ))
          )}
        </div>
      );
    }

    return (
      <Textarea
        value={state[type]}
        placeholder={isPending ? 'loading' : 'Click Generate button'}
        minRows={10}
        className="focus-visible:ring-0 focus-visible:ring-transparent"
        onChange={(e) => handleChange(type, e.target.value)}
      />
    );
  };

  const handleAccordionOpen = (type: AutoGenerateType) => {
    if (!state[type] || !state[type].length) {
      autoGenerate(type);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-y-scroll rounded-md bg-white  py-8">
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
                  <AccordionTrigger className="h-auto p-0 py-2 text-sm font-normal hover:no-underline">
                    Job Summary
                  </AccordionTrigger>
                  <AccordionContent>
                    {loadingState['jobDescription'] ? (
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
                    <AccordionTrigger
                      className="h-auto py-2 text-sm font-normal hover:no-underline"
                      onClick={() => handleAccordionOpen(type)}
                    >
                      {name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {loadingState[type] ? (
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
    <ul className="h-[218px] space-y-3 rounded-sm bg-white px-2 py-3">
      <li className="h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"></li>
      <li className="h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700 "></li>
      <li className="h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700 "></li>
      <li className="h-4 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700 "></li>
    </ul>
  );
};
