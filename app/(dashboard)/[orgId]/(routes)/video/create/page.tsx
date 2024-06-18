import FormTemplate from '@/components/interview/form-template';
import { HeaderNavigation } from '@/components/share';
import getOneTemplateInterview from '@/lib/actions/interview/getOneTemplate';
import { type ParamsProps } from '@/types/types';

const page = async ({ params, searchParams }: ParamsProps) => {
  const dataTemplate = await getOneTemplateInterview(searchParams?.id);
  return (
    <>
      <HeaderNavigation
        urlPath={`/${params.orgId}/video?tab=template`}
        title={`${searchParams?.id ? 'Edit' : 'Create'} Automatic Interview`}
        tagLine={`${searchParams?.id ? 'Edit' : 'Create'} detail Interview with question here`}
        isLabel
      />
      <FormTemplate
        orgId={params.orgId}
        queryId={searchParams.id}
        dataTemplate={searchParams.id ? dataTemplate : null}
      />
    </>
  );
};

export default page;
