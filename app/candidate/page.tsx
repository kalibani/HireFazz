import FormOtp from '@/components/candidate/form-otp';
import InvalidCandidate from '@/components/candidate/invalid-candidates';
import Questions from '@/components/candidate/questions';
import checkCandidate from '@/lib/actions/candidate/checkCandidate';
import { ParamsProps } from '@/types/types';

const pageCandidate = async ({ params, searchParams }: ParamsProps) => {
  const id = searchParams.id;
  const open = searchParams.open;
  const candidate = await checkCandidate(id);

  if (open === id + 'open') {
    return <Questions id={id} />;
  }
  if (candidate?.error) {
    return <InvalidCandidate />;
  }
  return <FormOtp id={id} />;
};

export default pageCandidate;
