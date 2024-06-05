import FormOtp from '@/components/candidate/form-otp';
import Questions from '@/components/candidate/questions';
import checkCandidate from '@/lib/actions/candidate/checkCandidate';
import { Loader } from '@/components/share';
import { ParamsProps } from '@/types/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const pageCandidate = async ({ searchParams }: ParamsProps) => {
  const { open, question, answer, id } = searchParams;
  const candidate = await checkCandidate(id);
  // if (candidate?.error || !candidate) {
  //   return redirect('/candidate/invalid-candidate');
  // }
  if (open === id + 'open' && candidate?.data?.isUsed && candidate?.data?.status === 'OPEN') {
    return (
      <Suspense fallback={<Loader />}>
        <Questions id={id} question={question} answer={answer} />
      </Suspense>
    );
  }

  if(candidate?.data?.status === 'INVITED' &&  !candidate?.data?.isUsed){
    return <FormOtp id={id} />;
  }
    return redirect('/candidate/invalid-candidate');

};

export default pageCandidate;
