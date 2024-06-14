import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import { title } from 'process';
import * as React from 'react';

interface EmailTemplateCandidatesProps {
  name: string;
  title: string;
  link: string;
  keyCode: string;
}

const EmailTemplateCandidates: React.FC<EmailTemplateCandidatesProps> = ({
  name,
  title,
  link,
  keyCode,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Selamat untuk {name}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px] text-center">
              <h1 className="text-xl font-semibold text-red-600">{title}</h1>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>Selamat 🎉</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Halo {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Kami dari <strong>{title}</strong> mengundang anda untuk
              interview. Silahkan klik tombol di bawah ini
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-red-600 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Interview Candidate
              </Button>
            </Section>
            <Text className="mb-4 text-[14px] leading-[24px] text-black">
              atau salin dan tempel url dibawah ini.
            </Text>
            <Link href={link} className="mb-4 text-blue-600 no-underline">
              {link}
            </Link>
            <Section className="my-6 text-center">
              <h4 className="text-md text-center font-semibold text-black">
                Gunakan kode verifikasi bawah ini
              </h4>
              <Text className="text-4xl font-bold text-red-600">{keyCode}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplateCandidates;
