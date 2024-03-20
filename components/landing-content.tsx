import Image from 'next/image';
import {
  CardDiscover,
  InfoDepartement,
  Pricing,
  UnlockCard,
  WrapperSection,
} from './landing-page';
import chatImage from '@/public/image/work-chat.png';
import {
  pricing,
  discoverContent,
  discoverContentRight,
  unlockContent,
} from '@/constant';

export const LandingContent = () => {
  return (
    <>
      <div className=" bg-[#F7FAFC] ">
        <WrapperSection className="justify-centerpx-16 flex flex-col items-center py-14">
          <h3 className="mb-11 text-center text-4xl font-bold">
            Discover how Berrylabs can enhance your work efficiency.
          </h3>
          <div className="relative mt-28 flex h-[500px] w-full items-center justify-center">
            <div className="relative z-10 flex w-full justify-between">
              <div className="space-y-4 text-left">
                <h3 className="mb-9 text-3xl font-bold text-primary">
                  Without Berrylabs
                </h3>
                {discoverContent.map((item) => (
                  <CardDiscover
                    key={item.title}
                    title={item.title}
                    description={item.desc}
                  />
                ))}
              </div>
              <div className="space-y-4 text-right">
                <h3 className="mb-9 text-3xl font-bold text-primary">
                  With Berrylabs
                </h3>
                {discoverContentRight.map((item) => (
                  <CardDiscover
                    key={item.title}
                    title={item.title}
                    description={item.desc}
                  />
                ))}
              </div>
            </div>
            <div className="absolute top-0">
              <Image
                src={chatImage}
                alt="picture"
                quality={80}
                sizes="100%"
                className="opacity-40"
              />
            </div>
          </div>
        </WrapperSection>
      </div>

      <WrapperSection className="mt-16 px-16 pb-20">
        <h3 className="mb-6 max-w-[65%] text-4xl font-bold ">
          See how different departments use Berrylabs!
        </h3>
        <InfoDepartement />
      </WrapperSection>

      <div className="bg-[#F7FAFC]">
        <WrapperSection className="px-16  pb-20 pt-14 text-center">
          <div className="mx-auto max-w-[600px]">
            <h3 className="mb-16 text-4xl font-bold ">
              Unlock the potential of Berrylabs!
            </h3>
            <p className="text-second-text mb-16 text-center text-2xl">
              Experience the seamless power of BerryLabs in effortlessly
              creating powerful automations.
            </p>
          </div>
          {unlockContent.map((item) => (
            <UnlockCard
              key={item.title}
              title={item.title}
              desc={item.desc}
              image={item.image}
            />
          ))}
        </WrapperSection>
      </div>

      <WrapperSection className="mt-16 px-4 pb-20 text-center sm:px-10">
        <h3 className="mb-6 text-4xl font-bold ">Berrylabs Pricing</h3>
        <p className="text-second-text text-2xl">
          Automate Without Breaking the Bank: Affordable Solutions for Every
          Business.
        </p>
        <Pricing items={pricing} />
      </WrapperSection>
    </>
  );
};
