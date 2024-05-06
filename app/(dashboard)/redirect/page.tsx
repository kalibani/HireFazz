'use client';
import LoaderGeneral from '@/components/share/loader';
import { orgList } from '@/lib/actions/user/orgList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const RedirectPage = () => {
  const { replace } = useRouter();
  const handleRedirectUser = async () => {
    const orgs = await orgList();
    if (orgs && orgs[0]) {
      const safeOrg = orgs[0].organization;
      replace(`/${safeOrg.id}/dashboard`);
    }
  };
  useEffect(() => {
    handleRedirectUser();
  }, []);
  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-white">
      <LoaderGeneral />
    </div>
  );
};

export default RedirectPage;
