import { LandingNavbar } from '@/components/landing-page/landing-navbar';
import { LandingHero } from '@/components/landing-page/landing-hero';
import { LandingContent } from '@/components/landing-page/landing-content';
import ContactUs from '@/components/contact-us';
import { Footer, LandingExpert } from '@/components/landing-page';

const LandingPage = () => {
  return (
    <>
      <LandingHero />
      <LandingContent />
      <LandingExpert />
    </>
  );
};

export default LandingPage;
