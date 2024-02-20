"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
// import { MAX_FREE_COUNTS } from "@/constant";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";

import { useRouter } from "next/navigation";

type FreeCounterProps = {
  apiLimitCount: number;
  subscriptionType: string;
  maxFreeCount: number | null;
};

const FreeCounter = ({
  subscriptionType,
  apiLimitCount = 0,
  maxFreeCount,
}: FreeCounterProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {maxFreeCount} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / maxFreeCount!) * 100}
            />
          </div>
          {subscriptionType !== "PREMIUM" ? (
            <Button
              className="w-full"
              variant="premium2"
              onClick={() => router.push("/pricing")}
            >
              Upgrade
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
