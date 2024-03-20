import { LandingNavbar } from '@/components/landing-navbar';
import { LandingHero } from '@/components/landing-hero';
import { LandingContent } from '@/components/landing-content';
import ContactUs from '@/components/contact-us';

const LandingPage = () => {
  return (
    <>
      <LandingNavbar />
      <LandingHero
        btnTitle="Get Started for Free"
        tagline="Transform Your Repetitive Tasks into Effortless Actions!"
        title="Say goodbye to repetitive tasks, hello to"
        isPoint
        variant="premium2"
        href="#"
      />
      <LandingContent />
      <LandingHero
        btnTitle="Talk to Expert"
        tagline="We've got you covered! Talk to our experts to find the best solution for you, anytime for free!"
        title="Haven't found which package is right for you?"
        variant="default"
        classNameH1="max-w-4xl"
        href="/expert"
      />
      <ContactUs />
    </>
  );
};

export default LandingPage;
