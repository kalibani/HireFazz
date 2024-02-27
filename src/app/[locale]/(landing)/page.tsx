import { LandingNavbar } from '@/components/landing-navbar';
import { LandingHero } from '@/components/landing-hero';
import { LandingContent } from '@/components/landing-content';
import ContactUs from '@/components/contact-us';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import pick from 'lodash/pick';
const LandingPage = () => {
  const messages = useMessages();
  return (
    <div className="h-full ">
      <NextIntlClientProvider messages={pick(messages, 'landing')}>
        <LandingNavbar />
        <LandingHero />
        <LandingContent />
        <ContactUs />
      </NextIntlClientProvider>
    </div>
  );
};

export default LandingPage;
