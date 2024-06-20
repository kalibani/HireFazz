import { Footer } from '@/components/landing-page';
import { LandingNavbar } from '@/components/landing-page/landing-navbar';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full overflow-auto bg-white">
      <LandingNavbar />
      <>{children}</>
      <Footer />
    </main>
  );
};

export default LandingLayout;
