import getTemplateInterview from '@/lib/actions/interview/getTemplatesInterview';
import { ParamsProps } from '@/types/types';
import FilterListInterview from '@/components/interview/filter-list-interview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionCard from '@/components/interview/question-card';
import { Banner } from '@/components/share';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';

type Interview = {
  id: string;
  title: string;
  description?: string;
  descriptionIntro?: string;
  introVideoUrl?: string;
  questions?: any;
};

const Page = async ({ params }: ParamsProps) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as Interview[];
  return (
    <>
      <Banner
        title="Automatic Interview"
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
        isButton={false}
      />
      <Tabs defaultValue="candidates">
        <div className="mb-8 flex flex-col  rounded-md bg-white p-4">
          <h3 className="text-2xl font-semibold">List Automatic Interview</h3>
          <p className="text-sm font-normal text-slate-400">
            There is automatic has been created.
          </p>
        </div>

        <TabsList className="h-auto rounded-none p-0">
          <TabsTrigger
            value="candidates"
            className="rounded-none rounded-tr-md py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Interview Candidates
          </TabsTrigger>
          <TabsTrigger
            value="template"
            className="rounded-none rounded-tr-md py-3"
          >
            Template Interview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="candidates" className="mt-0 bg-white p-4">
          <FilterListInterview orgId={params.orgId} />
          <div className="my-4 w-full text-center">
            <p>No Data</p>
          </div>
        </TabsContent>
        <TabsContent value="template" className="mt-0 bg-white p-4">
          <FilterListInterview orgId={params.orgId} />
          {interviews.length > 0 ? (
            interviews?.map((interview, idx) => (
              <QuestionCard
                key={interview.id}
                title={interview.title}
                id={interview.id}
                question={interview.description!}
                idx={idx}
                type="template"
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
