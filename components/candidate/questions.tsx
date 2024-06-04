import getCandidate from '@/lib/actions/candidate/getCandidate';
import React, { FC, Suspense } from 'react';
import InvalidCandidate from './invalid-candidates';
import WrapperQuestion from './wrapper-question';
import QuestionContent from './question-content';
import IntroContent from './intro-content';
import VideoQuestions from './video-questions';
import { Loader } from '../share';
import AnswerRecord from './answer-record';
import { formatSecondsToTime } from '@/helpers';

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
  const candidate = await getCandidate(id);
  if (candidate && typeof candidate === 'object') {
    const intro = (candidate as { intro?: Iintro })?.intro;
    const questions =
      (candidate as { questions?: Iquestions[] })?.questions ?? [];
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
                    ? questions[indexOfQuestion].videoUrl
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
            />
          </Suspense>
        )}
      </>
    );
  }
  return <InvalidCandidate />;
};

export default Questions;
