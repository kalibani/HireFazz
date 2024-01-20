import MaxWidthWrapper from "@/components/max-width-wrapper";
import UpgradeButton from "@/components/upgrade-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/constant";
import { cn } from "@/lib/utils";

import { ArrowRight, Check, HelpCircle, Minus, Asterisk } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

const Page = () => {
  const { userId } = auth();

  const pricingItems = [
    {
      plan: "Pay as You Go",
      tagline: "Small or Large projects, use as you wish.",
      quota: 10,
      quotaCharacter: "Flexible",
      features: [
        {
          text: "5 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "~10 hours of generated audio using text-to-speech",
        },
        {
          text: "Create up to 160 custom voices",
        },
        {
          text: "Unlimited total characters/month",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "High-quality responses",

          negative: false,
        },
        {
          text: "Priority support",
          negative: false,
        },
      ],
    },
    {
      plan: "Premium",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "premium")!.quota,
      quotaCharacter: "250.000",
      features: [
        {
          text: "25 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "~10 hours of generated audio using text-to-speech",
        },
        {
          text: "Create up to 160 custom voices",
        },
        {
          text: "Additional usage-based characters at IDR5000 per 1000 characters",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "High-quality responses",
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
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <TooltipProvider>
            {pricingItems.map(
              ({ plan, tagline, quota, quotaCharacter, features }) => {
                const price =
                  PLANS.find((p) => p.slug.toLowerCase() === plan.toLowerCase())
                    ?.price.amount || 0;

                return (
                  <div
                    key={plan}
                    className={cn("relative rounded-2xl bg-white shadow-lg", {
                      "border-2 border-blue-600 shadow-blue-200":
                        plan === "Premium",
                      "border border-gray-200": plan !== "Premium",
                    })}
                  >
                    {plan === "Premium" && (
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                        Upgrade now
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="my-3 text-center font-display text-3xl font-bold">
                        {plan}
                      </h3>
                      <p className="text-gray-500">{tagline}</p>
                      {plan !== "Premium" ? (
                        <p className="float-right relative sm:right-2 md:right-32 lg:right-6 top-3">
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5 flex">
                              <Asterisk className="h-4 w-4 text-zinc-500" />
                              <Asterisk className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {"Starting from"}
                            </TooltipContent>
                          </Tooltip>
                        </p>
                      ) : null}
                      <p className="my-5 font-display text-6xl font-semibold">
                        IDR {price.toLocaleString()}
                        {plan === "Premium" ? "Rb" : ""}
                      </p>
                      <p className="text-gray-500">
                        {" "}
                        {plan === "Premium"
                          ? "per month"
                          : "per document uploaded/voice downloaded"}
                      </p>
                    </div>

                    <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-1">
                        <div>
                          <p className="flex">
                            {quota.toLocaleString()} Files/mo included
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5 flex">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                Document Interaction Feature Access
                              </TooltipContent>
                            </Tooltip>
                          </p>
                          <p className="flex">
                            {quotaCharacter.toLocaleString()} total
                            characters/month
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5 flex">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                Generate Voice Feature Access
                              </TooltipContent>
                            </Tooltip>
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="my-10 space-y-5 px-8">
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
                      {plan === "Pay as You Go" ? (
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
                        <UpgradeButton />
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
              }
            )}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
