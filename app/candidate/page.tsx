import FormOtp from '@/components/candidate/form-otp';
import InvalidCandidate from '@/components/candidate/invalid-candidates';
import checkCandidate from '@/lib/actions/candidate/checkCandidate';
import { ParamsProps } from '@/types/types';

const pageCandidate = async ({ params, searchParams }: ParamsProps) => {
  const id = searchParams.id;
  const candidate = await checkCandidate(id);
  console.log(candidate?.error);
  if (candidate?.error) {
    return <InvalidCandidate />;
  }
  return <FormOtp id={id} />;
};

export default pageCandidate;
