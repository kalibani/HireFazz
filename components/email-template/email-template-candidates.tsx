import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface VercelInviteUserEmailProps {
  name: string;
  link: string;
}

export const EmailTemplateCandidates = ({
  name,
  link ='https://berrylabs.io',
}: VercelInviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Selamat untuk {name}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px] text-center">
              {/* <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel"
                className="mx-auto my-0"
              /> */}
              <h1 className="text-xl font-semibold text-red-600">
                Logo using url path
              </h1>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Congratulation</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Kami dari <strong>berrylabs</strong> (
              <Link
                href={`mailto:teams@berrylabs.io`}
                className="text-blue-600 no-underline"
              >
                teams@berrylabs.io
              </Link>
              ) mengundang and untuk interview. Silahkan klik tombol di bawah
              ini
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-red-600 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Interview Candidate
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              atau salin dan tempel url:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Section className="my-6 text-center">
              <h4 className="text-md text-center font-semibold">
                Gunakan kode verifikasi bawah ini
              </h4>
              <Text className="text-4xl font-bold">12345678</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplateCandidates;
