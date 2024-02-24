import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingContent } from "@/components/landing-content";
import ContactUs from "@/components/contact-us";
// import { useTranslations } from "next-intl";

const LandingPage = () => {
	// const t = useTranslations("landing");
	return (
		<div className="h-full ">
			<LandingNavbar />
			<LandingHero />
			<LandingContent />
			<ContactUs />
		</div>
	);
};

export default LandingPage;
