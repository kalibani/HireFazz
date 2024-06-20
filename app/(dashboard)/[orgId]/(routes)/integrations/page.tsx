import { ParamsProps } from '@/types/types';
import { redirect } from 'next/navigation';

const CommingSoon = ({ params }: ParamsProps) => {
  redirect(`/${params.orgId}/coming-soon`);
};

export default CommingSoon;
