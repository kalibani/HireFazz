import FormOtp from '@/components/candidate/form-otp';
import InvalidCandidate from '@/components/candidate/invalid-candidates';
import Questions from '@/components/candidate/questions';
import { Loader } from '@/components/share';
import checkCandidate from '@/lib/actions/candidate/checkCandidate';
import { ParamsProps } from '@/types/types';
import { Suspense } from 'react';

const pageCandidate = async ({ searchParams }: ParamsProps) => {
  const { open, question, answer, id } = searchParams;
  const candidate = await checkCandidate(id);
  if (open === id + 'open') {
    return (
      <Suspense fallback={<Loader />}>
        <Questions id={id} question={question} answer={answer} />
      </Suspense>
    );
  }
  if (candidate?.error) {
    return <InvalidCandidate />;
  }
  return <FormOtp id={id} />;
};

export default pageCandidate;
