import { ArrowRight } from 'lucide-react';
import { InfoDepartement } from './landing-page';

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
    </>
  );
};
