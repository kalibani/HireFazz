import { getOrgId } from '@/lib/actions/auth';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../use-current-user';

type TGetOrganizationId = {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
} | null;

export const useGetOrgId = (): UseQueryResult<TGetOrganizationId, Error> => {
  const user = useCurrentUser();
  return useQuery({
    enabled: !!user?.id,
    queryKey: ['getOrgId'],
    queryFn: async () => await getOrgId(user?.id),
  });
};
