import UsersContent, { IOrganizations } from '@/components/users/users-content';
import { getOrgMember } from '@/lib/actions/user/orgList';
import { ParamsProps } from '@/types/types';
import { FC } from 'react';

const PageUsers: FC<ParamsProps> = async ({ params }) => {
  const orgId = params.orgId;
  const organizations = await getOrgMember({
    organizationId: params.orgId,
  });
  console.log(organizations);
  return <UsersContent organizations={organizations!} orgId={orgId} />;
};
export default PageUsers;
