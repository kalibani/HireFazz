import { calculateAverage } from '@/helpers';
import { currentUser } from '@/lib/auth';
import { ExternalLink, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import React, { FC } from 'react';

interface IScore {
  id: string;
  point: number;
  questionId: string;
  comment: string;
  reviewer: { id: string; name: string };
}
export interface IEvaluationCandidate {
  candidateName: string;
  email: string;
  result: {
    questions: any[];
  };
  scores: IScore[];
  templateName: string;
}
const EvaluationCandidate: FC<IEvaluationCandidate | any> = async ({
  candidate,
}) => {
  const user = await currentUser();
  const questions = candidate.result.questions;
  const userScores = candidate.scores.filter(
    (score: any) => score.reviewer.id === user?.id,
  );
  const userScoreNumbers = userScores.map((score: IScore) => score.point);
  const userAverage = calculateAverage(userScoreNumbers);

  const teamScores = candidate.scores.filter(
    (score: any) => score.reviewer.id !== user?.id,
  );
  const teamScoreNumbers = teamScores.map((score: IScore) => score.point);
  const teamAverage = calculateAverage(teamScoreNumbers);

  const renderScoreSection = (
    title: string,
    scores: IScore[],
    average: number,
  ) => (
    <div className="flex flex-col gap-y-3">
      <div className="rounded-md bg-white p-3">
        <h4 className="font-semibold text-primary">{title}</h4>
      </div>
      <div className="flex flex-col gap-y-3 overflow-y-auto ">
        {scores.map((score: IScore, index: number) => (
          <div className="flex gap-x-3 " key={score.id}>
            <div className="flex w-[80%] flex-col rounded-md bg-white p-3">
              <Link href="#">
                <div className="flex items-center gap-x-1 text-xs hover:text-blue-500 hover:underline">
                  <p>{questions[index]?.title}</p>
                  <p>#{index + 1}</p>
                  <ExternalLink className="size-3 text-primary" />
                </div>
              </Link>
              <p className="my-1 line-clamp-2 text-xs text-slate-400">
                {questions[index]?.question}
              </p>
            </div>
            <div className="flex w-[20%] items-center justify-center rounded-md bg-white p-3 text-center font-semibold text-primary">
              {score.point}%
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-x-3 ">
        <div className="flex w-[80%] flex-col rounded-md bg-white p-3">
          <h4 className="font-semibold text-primary">Average Your Score</h4>
        </div>
        <div className="flex w-[20%] items-center justify-center rounded-md bg-white p-3 text-center font-semibold text-green-500">
          {average}%
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {renderScoreSection('Your Score Review', userScores, userAverage)}
        {renderScoreSection('Your Team Review', teamScores, teamAverage)}
        <div className="flex flex-col gap-y-3">
          <div className="rounded-md bg-white p-3">
            <h4 className="font-semibold text-primary">Ai Analyzer Review</h4>
          </div>
          <div className="flex items-start justify-center gap-x-3 rounded-md bg-white p-4">
            <LockKeyhole className="size-5 text-primary" />
            <p className="font-semibold">Fitur akan segera hadir</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluationCandidate;
