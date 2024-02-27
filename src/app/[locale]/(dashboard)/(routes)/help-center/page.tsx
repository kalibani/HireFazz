import React from 'react';
import pick from 'lodash/pick';

import ContactUs from '@/components/contact-us';
import Heading from '@/components/headings';
import { HeartHandshake } from 'lucide-react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

const Page = () => {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, 'landing')}>
      <Heading
        title="Help Center"
        description="Tell us what you need by sending email or whatsapp :)"
        icon={HeartHandshake}
        iconColor="text-red-700"
        bgColor="bg-red-500/10"
      />
      <ContactUs />
    </NextIntlClientProvider>
  );
};

export default Page;
