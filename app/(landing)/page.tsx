import { LandingHero } from '@/components/landing-page/landing-hero';
import { LandingContent } from '@/components/landing-page/landing-content';
import { LandingExpert } from '@/components/landing-page';

const LandingPage = () => {
  return (
    <div>
      <LandingHero />
      <LandingContent />
      <LandingExpert />
    </div>
  );
};

export default LandingPage;
