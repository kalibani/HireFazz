import React from 'react';
import Image from 'next/image';
import { contentRecruitment } from '@/constant';
import { cn } from '@/lib/utils';
const RecruitmentContent = () => {
  return (
    <div className="mt-24">
      <h2 className="mx-auto max-w-[750px] text-center text-2xl font-bold md:text-4xl">
        Streamline and Simplify the Hiring Process for
        <span className="text-primary"> Effortless</span> Hiring Success
      </h2>
      {contentRecruitment.map((item, i) => (
        <RecruitmentCard
          key={item.id}
          desc={item.desc}
          tagLine={item.tagline}
          title={item.title}
          image={item.image}
          index={i}
        />
      ))}
    </div>
  );
};

export default RecruitmentContent;

interface RecruitmentCard {
  title: string;
  desc: string;
  tagLine: string;
  image: any;
  index: number;
}
export const RecruitmentCard = ({
  desc,
  tagLine,
  title,
  image,
  index,
}: RecruitmentCard) => (
  <div
    className={cn(
      'mt-14 flex w-full flex-col gap-x-10 gap-y-4 rounded-lg p-4 sm:p-10 lg:flex-row  lg:items-center xl:gap-x-14 xl:px-16 xl:py-10',
      index % 2 !== 0
        ? 'items-end border bg-transparent'
        : ' items-start bg-[#F7FAFC]'
    )}
  >
    <div className="w-full sm:w-72 lg:w-fit">
      <Image src={image} alt="picture-berry" quality={80} sizes="100%" />
    </div>
    <div
      className={cn(
        'flex w-full flex-col divide-y-[1px] divide-primary lg:w-[65%] lg:text-left',
        index % 2 !== 0 ? ' text-right ' : 'text-left'
      )}
    >
      <div className="pb-2">
        <h3 className="text-2xl font-bold lg:text-4xl">{title}</h3>
        <p className="text-lg font-bold text-primary lg:text-2xl">{tagLine}</p>
      </div>
      <p className="pt-2 text-xs text-second-text lg:text-sm">{desc}</p>
    </div>
  </div>
);
