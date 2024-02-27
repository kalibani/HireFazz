import { SignIn } from "@clerk/nextjs";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	return (
		<SignIn path={`/${locale}/sign-in`} redirectUrl={`/${locale}/dashboard`} />
	);
}
