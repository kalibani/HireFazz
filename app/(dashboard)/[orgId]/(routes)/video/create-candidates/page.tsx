import FormTemplate from '@/components/interview/form-template';
import InviteCandidates from '@/components/interview/invite-candidates';
import { type ParamsProps } from '@/types/types';

const page = ({ params, searchParams }: ParamsProps) => {
  return <InviteCandidates />;
};

export default page;
