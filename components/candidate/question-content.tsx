import { ListChecks } from 'lucide-react';
import React, { FC } from 'react';
import TimeDisplay from './time-display';
import { formatSecondsToTime } from '@/helpers';
import { title } from 'process';

interface PropsQuestionContent {
  dataSource: {
    id: string;
    title: string;
    question: string;
    timeRead: number;
    timeAnswered: number;
  };
  questionIndex: number;
  totalQuestion: number;
}

const QuestionContent: FC<PropsQuestionContent> = ({
  dataSource,
  questionIndex,
  totalQuestion,
}) => {
  if (!dataSource) return null;
  const { id, title, question, timeAnswered, timeRead } = dataSource;
  return (
    <>
      <h4 className="my-5 flex items-center gap-x-2 text-left text-xl font-semibold text-primary">
        <ListChecks className="size-5" /> Question {questionIndex + 1} of{' '}
        {totalQuestion}
      </h4>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="my-6 text-sm">{question}</p>
      <TimeDisplay
        timeThinking={formatSecondsToTime(timeRead)}
        timeAnswer={formatSecondsToTime(timeAnswered)}
      />
    </>
  );
};

export default QuestionContent;
