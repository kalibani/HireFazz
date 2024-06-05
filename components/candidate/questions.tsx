import getCandidate from '@/lib/actions/candidate/getCandidate';
import React, { FC, Suspense } from 'react';
import WrapperQuestion from './wrapper-question';
import QuestionContent from './question-content';
import IntroContent from './intro-content';
import VideoQuestions from './video-questions';
import { Loader } from '../share';
import AnswerRecord from './answer-record';
import { formatSecondsToTime } from '@/helpers';
import { redirect } from 'next/navigation';

interface Iintro {
  videoUrl: string;
  description: string;
  templateName: string;
  name: string;
}
interface Iquestions {
  id: string;
  title: string;
  question: string;
  timeRead: number;
  videoUrl: string;
  timeAnswered: number;
  questionRetake: number;
}

const Questions: FC<{ id: string; question: string; answer: string }> = async ({
  id,
  question,
  answer,
}) => {
  const indexOfQuestion = Number(question);
  const candidate: any = await getCandidate(id);

  if (candidate?.error) {
    return redirect('/invalid-candidate');
  }

  const questions = candidate?.result.questions;
  const intro = candidate?.result.intro;

  const status = candidate?.status;
  const isUsed = candidate?.isUsed;

  if (status === 'COMPLETED' && indexOfQuestion === questions.length) {
    return redirect('/candidate/finish');
  }

  if (
    status !== 'COMPLETED' &&
    !!questions[indexOfQuestion]?.answered &&
    isUsed
  ) {
    return redirect(
      `/candidate?id=${id}&open=${id}open&question=${indexOfQuestion + 1}`,
    );
  }
  return (
    <>
      {!answer && (
        <WrapperQuestion
          videoContent={
            <VideoQuestions
              isQuestion={!!question}
              totalQuestion={questions?.length}
              videoKey={indexOfQuestion}
              videoUrl={
                !!question
                  ? questions[indexOfQuestion]?.videoUrl
                  : intro?.videoUrl!
              }
            />
          }
          mainContent={
            !!question ? (
              <QuestionContent
                dataSource={questions[indexOfQuestion]}
                questionIndex={indexOfQuestion}
                totalQuestion={questions.length}
              />
            ) : (
              <IntroContent name={intro?.name!} />
            )
          }
        />
      )}
      {!!answer && (
        <Suspense fallback={<Loader />}>
          <AnswerRecord
            timeAnswer={formatSecondsToTime(
              questions[indexOfQuestion].timeAnswered,
            )}
            question={questions[indexOfQuestion].question}
            questionId={questions[indexOfQuestion].id}
            totalQuestion={questions?.length}
          />
        </Suspense>
      )}
    </>
  );
};

export default Questions;
