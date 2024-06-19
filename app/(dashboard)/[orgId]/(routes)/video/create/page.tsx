import FormTemplate from '@/components/interview/form-template';
import { HeaderNavigation } from '@/components/share';
import getOneTemplateInterview from '@/lib/actions/interview/getOneTemplate';
import { type ParamsProps } from '@/types/types';
import { getTranslations } from 'next-intl/server';

const page = async ({ params, searchParams }: ParamsProps) => {
  const dataTemplate = await getOneTemplateInterview(searchParams?.id);
  const t = await getTranslations('Interview')
  return (
    <>
      <HeaderNavigation urlPath={`/${params.orgId}/video?tab=template`} />
      <div className="rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">{searchParams?.id ? t('editInterviewTemplate') : t('createInterviewTemplate')}</h3>
        <p className="text-sm font-normal text-slate-400">
          {searchParams?.id ? t('editInterviewDetail') : t('createInterviewDetail')}
        </p>

        <FormTemplate
          orgId={params.orgId}
          queryId={searchParams.id}
          dataTemplate={searchParams.id ? dataTemplate : null}
        />
      </div>
    </>
  );
};

export default page;
