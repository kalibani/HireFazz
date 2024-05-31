import InviteCandidates from '@/components/interview/invite-candidates';
import getOneCandidate from '@/lib/actions/interview/getOneCandidate';
import getTemplateInterview from '@/lib/actions/interview/getTemplatesInterview';
import { TInterview } from '@/lib/validators/interview';
import { type ParamsProps } from '@/types/types';

const page = async ({ params, searchParams }: ParamsProps) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as TInterview[];

  const candidate = await getOneCandidate({ id: searchParams.idInvite });
  return (
    <InviteCandidates
      orgId={params.orgId}
      interviews={interviews}
      //@ts-ignore
      candidate={candidate}
    />
  );
};

export default page;
