'use client';

import { Loader } from '@/components/share';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';
import { inviteOrg } from '@/lib/actions/user/orgList';
import { useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

export interface IOrganizations {
  organizations: {
    role: { name: string };
    user: { name: string | null; id: string };
    organization: { id: string; logo: string | null; name: string };
  }[];
  orgId: string;
}
const UsersContent = ({ organizations, orgId }: IOrganizations) => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');

  const selectedOrg = useMemo(() => {
    return organizations.find((el) => el.organization.id === orgId);
  }, [orgId, organizations]);

  const handleInvite = () => {
    startTransition(async () => {
      try {
        const invited = await inviteOrg({ organizationId: orgId, email });
        if (!!invited)
          toast.success('berhasil menambah user ke dalam organisasi');
      } catch (error) {
        toast.error('gagal menambah user ke organisasi, check kembali email');
      }
    });
  };

  return (
    <>
      {isPending && <Loader />}
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
          {organizations?.map((el) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default UsersContent;
