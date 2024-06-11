'use client';

import { Loader } from '@/components/share';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrgMember, inviteOrg, orgList } from '@/lib/actions/user/orgList';
import { ParamsProps } from '@/types/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
interface Organization {
  organization: {
    id: string;
    name: string;
    logo: string | null;
  };
}
const CommingSoon = ({ params }: ParamsProps) => {
  const [list, setList] = useState<Organization[]>([]);
  const selectedOrg = useMemo(() => {
    return list.find((el) => el.organization.id === params.orgId);
  }, [params.orgId, list]);
  const { data, isFetching, refetch } = useQuery({
    queryFn: async () =>
      await getOrgMember({ organizationId: params.orgId as string }),
    queryKey: ['member list', params.orgId],
    retry: false,
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: (prop: { email: string; organizationId: string }) =>
      inviteOrg(prop),
    retry: false,
    onError: () => {
      toast.error('gagal menambah user ke organisasi, check kembali email');
    },
    onSuccess: () => {
      setEmail('');
      toast.success('berhasil menambah user ke dalam organisasi');
      refetch();
    },
  });
  const [email, setEmail] = useState('');
  const handleFetchOrg = async () => {
    try {
      const org = await orgList();
      if (org) {
        setList(org);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleFetchOrg();
  }, []);
  const handleInvite = async () => {
    mutate({
      email,
      organizationId: params.orgId,
    });
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="rounded bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="flex-1 text-lg font-bold capitalize">
            Organisasi {selectedOrg?.organization?.name}
          </h1>
          <div className="flex">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="input user email"
              className="rounded-r-none"
            />
            <Button onClick={handleInvite} className="rounded-l-none">
              Invite
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded bg-white p-4">
        <h2 className="flex-1 text-lg font-bold">Daftar anggota:</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {isFetching ? (
            <>
              <Skeleton className="h-[104px] w-[250px] rounded-lg" />
              <Skeleton className="h-[104px] w-[250px] rounded-lg" />
              <Skeleton className="h-[104px] w-[250px] rounded-lg" />
            </>
          ) : (
            data?.map((el) => (
              <div
                className="max-w-[250px] flex-1 rounded-lg p-4 shadow-lg"
                key={el.user.id}
              >
                <div className="flex items-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-300 uppercase">
                    {el.user.name ? el.user.name[0] : ''}
                  </div>
                  <p className="ml-4 capitalize">{el.user.name}</p>
                </div>
                <div className="mt-2 flex items-center">
                  <p className="text-sm text-slate-600">Role:</p>
                  <p className="ml-6 text-base capitalize">
                    {el.role.name.toLocaleLowerCase()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CommingSoon;
