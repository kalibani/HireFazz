import FormTemplate from '@/components/interview/form-template';
import InviteCandidates from '@/components/interview/invite-candidates';
import { type ParamsProps } from '@/types/types';

const page = ({ params, searchParams }: ParamsProps) => {
  return <InviteCandidates orgId={params.orgId} />;
};

export default page;
