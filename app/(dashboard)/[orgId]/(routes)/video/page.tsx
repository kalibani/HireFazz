import getTemplateInterview from '@/lib/actions/interview/getTemplatesInterview';
import { ParamsProps } from '@/types/types';
import FilterListInterview from '@/components/interview/filter-list-interview';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Banner, SectionWrap } from '@/components/share';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
import { TCandidateListSchema, TInterview } from '@/lib/validators/interview';
import getInvitedCandidates from '@/lib/actions/interview/getInvitedCandidates';
import { FC } from 'react';
import TriggerTab from '@/components/interview/trigger-tab';
import CandidatesCard from '@/components/interview/candidate-card';
import QuestionCard from '@/components/interview/question-card';

const Page: FC<ParamsProps> = async ({ params, searchParams }) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as TInterview[];
  const candidates = (await getInvitedCandidates({
    id: params.orgId,
  })) as TCandidateListSchema[];
  return (
    <>
      <Banner
        title="Automatic Interview"
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
        isButton={false}
      />
      <Tabs defaultValue={searchParams.tab || 'candidates'}>
        <div className="mb-8 flex flex-col  rounded-md bg-white p-4">
          <h3 className="text-2xl font-semibold">List Automatic Interview</h3>
          <p className="text-sm font-normal text-slate-400">
            There is automatic has been created.
          </p>
        </div>
        <TriggerTab />
        <TabsContent value="candidates" className="mt-0 bg-white p-4">
          <FilterListInterview orgId={params.orgId} />
          <div className="my-4 w-full ">
            {candidates.length > 0 ? (
              candidates.map((item, idx) => (
                <CandidatesCard key={item.id} dataSource={item} index={idx} />
              ))
            ) : (
              <div className="my-4 w-full text-center">
                <p>No Data</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="template" className="mt-0 bg-white p-4">
          <FilterListInterview orgId={params.orgId} isTemplate />
          {interviews.length > 0 ? (
            interviews?.map((interview, idx) => (
              <QuestionCard 
                key={interview.id}
                title={interview.title}
                id={interview.id}
                question={interview.description!}
                idx={idx}
                type="template"
                dataSource={interview}
              />
            ))
          ) : (
            <div className="my-4 w-full text-center">
              <p>No Data</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;
