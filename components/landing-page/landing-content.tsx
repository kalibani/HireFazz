import Image from 'next/image';
import {
  CardDiscover,
  InfoDepartement,
  Pricing,
  UnlockCard,
  WrapperSection,
} from '.';
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
      <div className="bg-[#F7FAFC] py-8 lg:h-[900px]">
        <WrapperSection className="flex h-fit  flex-col items-center justify-center px-4 sm:px-16">
          <h3 className="text-center text-2xl font-bold lg:mb-11 lg:text-4xl">
            Discover how Berrylabs can enhance your work efficiency.
          </h3>
          <div className="mt-8 flex w-full items-center justify-center lg:relative lg:mt-28 lg:h-[500px] ">
            <div className="flex w-full flex-col justify-between  lg:relative lg:z-10 lg:flex-row">
              <div className="w-full space-y-4  text-left lg:w-fit">
                <h3 className="text-xl font-bold text-primary lg:mb-9 lg:text-3xl">
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
              <div className="mt-8 w-full space-y-4  text-right  lg:mt-0 lg:w-fit">
                <h3 className="text-xl font-bold text-primary lg:mb-9 lg:text-3xl">
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
            <div className="top-0 hidden lg:absolute lg:block">
              <Image
                src={chatImage}
                alt="picture"
                quality={50}
                sizes="100%"
                className="opacity-40"
                placeholder="blur"
              />
            </div>
          </div>
        </WrapperSection>
      </div>

      <WrapperSection className="mt-16 px-4 pb-20 md:px-16">
        <h3 className="mb-6 font-bold [font-size:_clamp(14px,5vw,30px)]">
          See how different departments use Berrylabs!
        </h3>
        {/* <InfoDepartement /> */}
      </WrapperSection>

      <div className="bg-[#F7FAFC]">
        <WrapperSection className="px-4 pb-20  pt-14 text-center md:px-16">
          <div className="mx-auto max-w-[600px]">
            <h3 className="mb-8 text-2xl font-bold lg:mb-16 lg:text-4xl ">
              Unlock the potential of Berrylabs!
            </h3>
            <p className="text-center text-second-text lg:mb-16 lg:text-2xl">
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
      <WrapperSection
        className="mt-6 px-4 pb-20 pt-20 text-center sm:px-10"
        id="pricing"
      >
        <h3 className="mb-4 text-2xl font-bold lg:mb-6 lg:text-4xl ">
          Berrylabs Pricing
        </h3>
        <p className="mb-6 text-lg text-second-text lg:text-2xl">
          Automate Without Breaking the Bank: Affordable Solutions for Every
          Business.
        </p>
        <Pricing items={pricing} />
      </WrapperSection>
    </>
  );
};
