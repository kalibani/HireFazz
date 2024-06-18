import { FC, PropsWithChildren, ReactElement } from 'react';
import { Navbar, SideBar } from '@/components/share';
import { orgList } from '@/lib/actions/user/orgList';
import { TopupModal } from '@/components/topup-modal';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const DashboardLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  const org = await orgList();
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <div className="flex h-full bg-[#F2F2F7]">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <TopupModal />
        <SideBar />
        <Navbar orgs={org} />
        <main className="h-full w-full overflow-y-auto pl-[80px] pt-[60px]">
          {children}
        </main>
      </NextIntlClientProvider>
    </div>
  );
};

export default DashboardLayout;
