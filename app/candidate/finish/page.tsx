import React from 'react';
import Logo from '@/public/BerryLabs.png';
import Image from 'next/image';
import Link from 'next/link';

const pageFinish = () => {
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center rounded-2xl border bg-white p-4 md:size-[600px]">
      <Link href="/">
        <div className="flex items-end gap-x-1">
          <Image src={Logo} alt="logo" width={30} />
          <h4 className="text-sm font-semibold text-primary">HireFazz.io</h4>
        </div>
      </Link>
      <div className="my-28 flex w-full flex-col ">
        <h1 className="text-center text-5xl font-extrabold lg:text-7xl 2xl:text-8xl">
          <span className="bg-gradient-to-br from-teal-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
            Terima
          </span>

          <span className="bg-gradient-to-tr from-blue-500 via-pink-500 to-red-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
            kasih!
          </span>
        </h1>
        <h4 className="my-2 text-center text-xl font-bold text-slate-700"></h4>
      </div>
    </div>
  );
};

export default pageFinish;
