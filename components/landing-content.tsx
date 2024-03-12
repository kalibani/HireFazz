import { ArrowRight } from 'lucide-react';
import { InfoDepartement, Pricing, UnlockCard } from './landing-page';

export const LandingContent = () => {
  return (
    <>
      <section className="px-10 pb-20">
        <h3 className="font-bold text-4xl max-w-[60%] mb-11">
          Lets see how Berrylabs make your works more efficient
        </h3>
        <div className="flex justify-between items-center">
          <div className="w-[514px] space-y-4">
            <div className="h-[282px] w-full bg-gray-500">
              this willbe an image
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at
              magna sit amet urna facilisis ullamcorper. In id velit a leo
              dictum tincidunt ac vitae dolor. In id velit a leo dictum
              tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac
              vitae dolor.
            </p>
          </div>
          <ArrowRight className="w-16 h-16" />
          <div className="w-[514px] space-y-4">
            <div className="h-[282px] w-full bg-gray-500">
              this willbe an image
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at
              magna sit amet urna facilisis ullamcorper. In id velit a leo
              dictum tincidunt ac vitae dolor. In id velit a leo dictum
              tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac
              vitae dolor.
            </p>
          </div>
        </div>
      </section>

      <section className="px-10 pb-20 mt-16">
        <h3 className="font-bold text-4xl max-w-[65%] mb-6 ">
          See how different department use Berrylabs!
        </h3>
        <InfoDepartement />
      </section>

      <section className="px-10 pb-20 mt-16 text-center">
        <h3 className="font-bold text-4xl  mb-6 ">
          Unlock the potential of Berrylabs!
        </h3>
        <p className="text-2xl">
          BerryLabs gives you the power to build powerful automations,
          effortlessly.
        </p>

        <UnlockCard />
        <UnlockCard />
        <UnlockCard />
        <UnlockCard />
        <UnlockCard />
        <UnlockCard />
      </section>

      <section className="px-10 pb-20 mt-16 text-center">
        <h3 className="font-bold text-4xl  mb-6 ">Berrylabs Pricing</h3>
        <p className="text-2xl">
          Automate Without Breaking the Bank: Affordable Solutions for Every
          Business.
        </p>

        <Pricing items={items} />
      </section>
    </>
  );
};

const items = [
  {
    id: 1,
    title: 'core features',
    price: '',
    benef: ['Benefit 1', 'Benefit 2', 'Benefit 3', 'Benefit 4', 'Benefit 5'],
  },
  {
    id: 2,
    title: 'free',
    price: 'Rp 0/month',
    benef: ['Benefit 1', 'Benefit 2', 'no', 'no', 'no'],
  },
  {
    id: 3,
    title: 'basic',
    price: 'Rp 299.000/month',
    benef: ['Benefit 1', 'Benefit 2', 'yes', 'no', 'no'],
  },
  {
    id: 4,
    title: 'pro',
    price: 'Rp 590.000/month',
    benef: ['Benefit 1', 'Benefit 2', 'yes', 'yes', 'no'],
  },
  {
    id: 5,
    title: 'premium',
    price: 'Rp 990.000/month',
    benef: ['Benefit 1', 'Benefit 2', 'yes', 'yes', 'yes'],
  },
];
