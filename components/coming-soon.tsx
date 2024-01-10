import Image from "next/image";
import React from "react";

type Props = {};

const ComingSoon = (props: Props) => {
  return (
    <section className="w-full min-h-screen bg-white dark:bg-gray-900">
      <div className="container relative flex flex-col min-h-screen px-6 py-8 mx-auto">
        <section className="flex items-center flex-1">
          <div className="flex flex-col w-full ">
            <h1 className="text-5xl font-extrabold text-center lg:text-7xl 2xl:text-8xl">
              <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                Coming
              </span>

              <span className="text-transparent bg-gradient-to-tr bg-clip-text from-blue-500 via-pink-500 to-red-500 dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
                {" "}
                Soon
              </span>
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 dark:text-white md:text-xl">
              We are creating something great. Stay tuned!
            </p>

            <div className="flex flex-col mt-8 space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0">
              <input
                id="email"
                type="text"
                className="px-6 py-3 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring sm:mx-2"
                placeholder="Email Address"
              />

              <button className="px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none sm:mx-2">
                Notify Me
              </button>
            </div>

            <p className="mt-8 text-center text-gray-700 dark:text-white text-md md:text-xl">
              Notify me when App is launched :)
            </p>
          </div>
        </section>

        <footer className="flex flex-col items-center mt-12 sm:flex-row sm:justify-between">
          <a
            href="#"
            className="text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            {" "}
            Privacy Policy{" "}
          </a>

          <div className="mt-4 -mx-4 md:mt-0">
            <a
              href="#"
              className="px-4 text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {" "}
              Facebook
            </a>

            <a
              href="#"
              className="px-4 text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Instagram
            </a>

            <a
              href="#"
              className="px-4 text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {" "}
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ComingSoon;
