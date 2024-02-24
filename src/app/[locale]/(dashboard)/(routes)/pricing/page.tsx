import MaxWidthWrapper from "@/components/max-width-wrapper";
import UpgradeButton from "@/components/upgrade-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { PLANS, subscriptionTypes } from "@/constant";
import { cn } from "@/lib/utils";

import { ArrowRight, Check, HelpCircle, Minus, Asterisk } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/api-limit";

const Page = async () => {
  const { userId } = auth();
  const { subscriptionType, maxFreeCount, count } = await getUser(userId!);

  const pricingItems = [
    {
      plan: "Basic",
      price: 249000,
      tagline: "Suitable for Generalists.",
      quota: 250,
      quotaCharacter: "125.000",
      features: [
        {
          text: "25 Free Generations",
        },
        {
          text: "Up to 25 Files per Upload",
        },
        {
          text: "5 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "High-accuracy responses",

          negative: false,
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Priority support",
          negative: false,
        },
      ],
    },
    {
      plan: "Pro",
      price: 499000,
      tagline: "Suitable For Specialists.",
      quota: 500,
      quotaCharacter: "125.000",
      features: [
        {
          text: "25 Free Generations",
        },
        {
          text: "Up to 50 Files per Upload",
        },
        {
          text: "10 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "High-accuracy responses",

          negative: false,
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Priority support",
          negative: false,
        },
      ],
    },
    {
      plan: "Premium",
      price: 999000,
      tagline: "Suitable For Aggressive Specialists.",
      quota: 1000,
      quotaCharacter: "250.000",
      features: [
        {
          text: "25 Free Generations",
        },
        {
          text: "Up to 100 Files per Upload",
        },
        {
          text: "15 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "High-accuracy responses",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <>
      <MaxWidthWrapper className="mb-8 text-center max-w-5xl">
        <div className="mx-auto sm:max-w-lg">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, price, features }) => {
              return (
                <div
                  key={plan}
                  className={cn("relative rounded-2xl bg-white shadow-lg", {
                    "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
                    "border border-gray-200": plan !== "Pro",
                  })}
                >
                  {plan === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                      Best seller
                    </div>
                  )}

                  <div className="p-4 space-y-2 mt-1">
                    <h3 className="text-center font-display text-2xl">
                      {plan}
                    </h3>
                    <p className="text-sm text-gray-500">{tagline}</p>

                    <p className="font-display text-3xl font-semibold">
                      IDR {price.toLocaleString()}
                      {/* {plan === "Free" ? "" : "Rb"} */}
                    </p>
                    {/* <p className="text-gray-500">
                        {" "}
                        {plan === "Premium"
                          ? "Unlimited Access"
                          : "per document uploaded/voice downloaded"}
                      </p> */}
                  </div>

                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <div>
                        <p className="flex">
                          {quota}
                          {plan === "Free"
                            ? " Files included"
                            : " Files/mo included"}
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5 mt-0.5 flex">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              The maximum amount of files upload.
                            </TooltipContent>
                          </Tooltip>
                        </p>
                        {/* <p className="flex">
                            {quotaCharacter.toLocaleString()} total
                            characters/month
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5 flex">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                The maximum amount of total characters per
                                month.
                              </TooltipContent>
                            </Tooltip>
                          </p> */}
                      </div>
                    </div>
                  </div>

                  <ul className="my-10 space-y-5 px-6">
                    {features.map(({ text, footnote, negative }, index) => (
                      <li key={index} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-gray-300" />
                          ) : (
                            <Check className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-gray-600", {
                                "text-gray-400": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-gray-600 text-left", {
                              "text-gray-400": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200" />
                  <div className="p-5">
                    {subscriptionType?.toLowerCase() === plan.toLowerCase() &&
                    maxFreeCount! > count ? (
                      <Link
                        href={userId ? "/dashboard" : "/sign-in"}
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                      >
                        {userId ? "Start Generating" : "Sign up"}
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    ) : userId ? (
                      <UpgradeButton plan={plan} price={price} quota={quota} />
                    ) : (
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {userId ? "Upgrade now" : "Sign up"}
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
