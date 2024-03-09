import { LandingNavbar } from '@/components/landing-navbar';
import { LandingHero } from '@/components/landing-hero';
import { LandingContent } from '@/components/landing-content';
import ContactUs from '@/components/contact-us';

const LandingPage = () => {
  return (
    <>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
      <ContactUs />
    </>
  );
};

export default LandingPage;
