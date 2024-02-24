import { SignUp } from "@clerk/nextjs";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	return (
		<SignUp path={`/${locale}/sign-up`} redirectUrl={`/${locale}/dashboard`} />
	);
}
