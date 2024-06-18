'use client';
import React, { useEffect, useReducer, useState, useTransition } from 'react';
import { ArrowRight, Info, Plus, CheckIcon, X } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { errorToast } from '@/components/toasterProvider';
import { useTranslations } from 'next-intl';
import { useTranslate } from '@/hooks/use-translate';

const ReactQuill = dynamic(
  () => import('react-quill'),

  { ssr: false },
);

const initialState = {
  jobDescription: '',
  skill: [],
  responsibilities: [],
  requirement: [],
};

const dataAccordion: dataAccordionType[] = [
  { name: 'skills', type: 'skill' },
  { name: 'responsibilities', type: 'responsibilities' },
  { name: 'requirements', type: 'requirement' },
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

interface DetailItem {
  value: string;
  checked: boolean;
  hidden?: boolean;
}

// list of key for translation
const headerMap: Record<AutoGenerateType, string> = {
  jobDescription: 'job_summary',
  skill: 'skills',
  responsibilities: 'responsibilities',
  requirement: 'requirement',
};

const CreateJobDetail = () => {
  const { setStep, setFormDetailJob, dataCreateJob, dataDetailJob } = useFormStepStore(
    (state) => state,
  );
  const t = useTranslations('CreateJob')
  const { language } = useTranslate()

  const [value, setValue] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listOfEditor, setListOfEditor] = useState<string[]>(['']);
  const [mount, setMount] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({});
  const [checkedSkillsList, setCheckedSkillsList] = useState<Set<string>>(
    new Set(),
  );
  const { companyName, currency, experiences, location, title, workModel } =
    dataCreateJob;
  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    const genrate = () => {
      setLoadingState((value) => ({ ...value, jobDescription: true }));
      startTransition(async () => {
        const { result } = await genereteJobDescription(dataCreateJob, language).catch((err) => errorToast(typeof err === 'string' ? err : undefined))
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

  const handleChange = (field: string, value: string | DetailItem[]) => {
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
            language
          ).catch((err) => errorToast(typeof err === 'string' ? err : undefined))
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
          // make it as array of object, so we can utilize checkbox functionality
          const preparedSkillResult = skillSet.map((skill: string) => ({
            value: skill,
            // initial checked if already existed in editor
            checked: checkedSkillsList.has(skill),
          }));
          handleChange('skill', preparedSkillResult);
          setLoadingState((value) => ({ ...value, skill: false }));
          break;
        case 'responsibilities':
          const { result: responsibilitiesResult } =
            await generateResponsibilities(dataCreateJob, language).catch((err) => errorToast(typeof err === 'string' ? err : undefined))
          // make it as array of object, so we can utilize checkbox functionality
          const preparedResponsibilitiesResult = responsibilitiesResult.map(
            (responsibility: string) => ({
              value: responsibility,
              checked: false,
            }),
          );
          handleChange('responsibilities', preparedResponsibilitiesResult);
          setLoadingState((value) => ({ ...value, responsibilities: false }));
          break;
        case 'requirement':
          const { result: requirementResult } =
            await generateRequirement(dataCreateJob, language).catch((err) => errorToast(typeof err === 'string' ? err : undefined))
          // make it as array of object, so we can utilize checkbox functionality
          const preparedRequirementResult = requirementResult.map(
            (requirement: string) => ({
              value: requirement,
              checked: false,
            }),
          );

          handleChange('requirement', preparedRequirementResult);
          setLoadingState((value) => ({ ...value, requirement: false }));
          break;
        case 'jobDescription':
          const { result: jobDescriptionResult } =
            await genereteJobDescription(dataCreateJob, language).catch((err) => errorToast(typeof err === 'string' ? err : undefined))
          handleChange('jobDescription', jobDescriptionResult);
          setLoadingState((value) => ({ ...value, jobDescription: false }));
          break;
        default:
          break;
      }
    });
  };

  const addToEditor = (type: AutoGenerateType) => {
    const htmlDescription = `<p><strong>${t(headerMap[type])} :</strong></p><p>${state[type]}</p><br/>`;
    setListOfEditor((prev) => {
      const newListOfEditor = [...prev];
      switch (type) {
        case 'jobDescription':
          newListOfEditor[0] = htmlDescription;
          break;
        case 'skill':
          renderSkilltoEditor(Array.from(checkedSkillsList));
          break;
        case 'responsibilities':
          const checkedResponsibilities = state[type]
            .filter((responsibility: DetailItem) => responsibility.checked)
            .map((item: DetailItem) => item.value);
          const listOfResponsiblities = generateHtmlList(
            checkedResponsibilities,
          );
          if (listOfResponsiblities.length) {
            newListOfEditor[2] = `<p><strong>${t(headerMap[type])} :</strong></p>${listOfResponsiblities}<br/>`;
          } else {
            newListOfEditor[2] = '';
          }
          break;
        case 'requirement':
          const checkedRequirements = state[type]
            .filter((requirement: DetailItem) => requirement.checked)
            .map((item: DetailItem) => item.value);
          const listOfRequirement = generateHtmlList(checkedRequirements);
          if (listOfRequirement.length) {
            newListOfEditor[3] = `<p><strong>${t(headerMap[type])} :</strong></p>${listOfRequirement}<br/>`;
          } else {
            newListOfEditor[3] = '';
          }
          break;
        default:
          break;
      }
      return newListOfEditor;
    });
  };

  const generateHtmlList = (arr: string[]) => {
    if (!arr.length) return '';
    const value = `
      <ul>
        ${arr.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `;
    return value;
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

  const updateCheckData = (
    type: AutoGenerateType,
    idx: number,
    isChecked: boolean,
  ) => {
    const newData = [...state[type]];
    if (!newData.length) return;

    newData[idx].checked = isChecked;
    handleChange(type, newData);

    if (type === 'skill') {
      const newSet = new Set(checkedSkillsList);
      if (isChecked) {
        newSet.add(newData[idx].value);
      } else {
        newSet.delete(newData[idx].value);
      }
      setCheckedSkillsList(newSet);
      renderSkilltoEditor(Array.from(newSet));
    }
  };

  const handleDeleteSkill = (item: string) => {
    const newSkill = state.skill.map((skill: DetailItem) => {
      if (skill.value === item) {
        return {
          ...skill,
          hidden: true,
        };
      } else {
        return skill;
      }
    });
    handleChange('skill', newSkill);
  };

  const renderSkilltoEditor = (skill: string[]) => {
    setListOfEditor((prev: string[]) => {
      const newListOfEditor = [...prev];
      const checkedSkills = skill;
      const listOfSkill = generateHtmlList(checkedSkills);
      const skillHtml = `<p><strong>${t(headerMap['skill'])} :</strong></p>${listOfSkill}<br/>`;
      if (listOfSkill.length) {
        newListOfEditor[1] = skillHtml;
      } else {
        newListOfEditor[1] = '';
      }
      return newListOfEditor;
    });
  };

  // to display content from dataAccordion, output: accordion content base on data type
  const getContent = (type: AutoGenerateType) => {
    if (!state[type].length) {
      return (
        <div className="flex min-h-[218px] w-full flex-col flex-wrap gap-3 overflow-y-auto rounded-sm bg-white p-2">
          <span>Click Generate button</span>
        </div>
      );
    }

    // skills to render list of button that will directly update the text editor when click (base on last checked status in data)
    if (type === 'skill') {
      return (
        <div className="flex min-h-[218px] w-full flex-col flex-wrap gap-3 overflow-y-auto rounded-sm bg-white p-2">
          {state[type].map((data: DetailItem, idx: number) => {
            if (data.hidden) return null;
            return (
              <div key={data.value + idx} className="flex items-center gap-2">
                <Button
                  className="relative flex h-fit items-center gap-2 text-left"
                  variant={data.checked ? 'default' : 'outline'}
                  onClick={() => updateCheckData(type, idx, !data.checked)}
                >
                  {data.checked ? (
                    <CheckIcon className="size-4 shrink-0" />
                  ) : (
                    <Plus className="size-4 shrink-0" />
                  )}
                  <span>{data.value}</span>

                  <div
                    className="absolute -right-2 -top-2 z-10 flex size-4 items-center justify-center rounded-full bg-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSkill(data.value);
                    }}
                  >
                    <X className="size-3" />
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex min-h-[218px] w-full flex-col flex-wrap gap-3 overflow-y-auto rounded-sm bg-white p-2">
        {state[type].map((data: DetailItem, idx: number) => {
          return (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox
                onCheckedChange={(checked) =>
                  updateCheckData(type, idx, Boolean(checked))
                }
              />
              <span>{data.value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleAccordionOpen = (type: AutoGenerateType) => {
    if (!state[type] || !state[type].length) {
      autoGenerate(type);
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center overflow-y-scroll rounded-md bg-white py-8">
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-12 py-4">
        <div className="flex h-full w-full gap-x-3">
          <div className="h-full w-full max-w-[445px] space-y-2 overflow-y-auto">
            <div className="overflow-hidden rounded-md border">
              <div className="border-b p-4">
                <div className="flex items-center gap-2">
                  <span>
                    <Info className="h-6 w-6 text-green-600" />
                  </span>
                  <p className="text-sm font-normal text-second-text">
                    {t('description_label')}
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
                    {t('job_summary')}
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
                        {t('regenerate')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-auto p-0 text-sm font-normal hover:bg-transparent"
                        onClick={() => addToEditor('jobDescription')}
                        disabled={isPending}
                      >
                        {t('addToEditor')} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {dataAccordion.map(({ name, type }) => (
              <div className="overflow-hidden rounded-md border" key={name}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={type} className="bg-slate-200 p-2">
                    <AccordionTrigger
                      className="h-auto py-2 text-sm font-normal hover:no-underline"
                      onClick={() => handleAccordionOpen(type)}
                    >
                      {t(name)}
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
                          {t('regenerate')}
                        </Button>
                        {type !== 'skill' && (
                          <Button
                            variant="ghost"
                            className="w-auto p-0 text-sm font-normal hover:bg-transparent "
                            onClick={() => addToEditor(type)}
                            disabled={isPending}
                          >
                            {t('addToEditor')}{' '}
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-y-4">
            <div className="w-full flex-1 rounded-md bg-white">
              <ReactQuill
                //@ts-ignore
                theme="snow"
                value={value || dataDetailJob}
                onChange={setValue}
                className="h-[calc(100%-44px)] w-full border-none"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="min-w-32" onClick={prevStep}>
                {t('cta_prev')}
              </Button>
              <Button className="min-w-32" disabled={!(value || dataDetailJob)} onClick={nextStep}>
                {t('cta_next')}
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
