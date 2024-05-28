import InviteCandidates from '@/components/interview/invite-candidates';
import getTemplateInterview from '@/lib/actions/interview/getTemplatesInterview';
import { TInterview } from '@/lib/validators/interview';
import { type ParamsProps } from '@/types/types';

const page = async ({ params, searchParams }: ParamsProps) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as TInterview[];
  return <InviteCandidates orgId={params.orgId} interviews={interviews} />;
};

export default page;
