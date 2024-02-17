import prismadb from "./prismadb";

import { MAX_FREE_COUNTS } from "@/constant";

export const increaseApiLimit = async (userId: string) => {
  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userAPILimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit && userApiLimit.count < MAX_FREE_COUNTS) {
    await prismadb.userAPILimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else if (!userApiLimit) {
    await prismadb.userAPILimit.create({
      data: { userId: userId, count: 1 },
    });
  } else {
    return userApiLimit;
  }
};

export const checkApiLimit = async (userId: string) => {
  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userAPILimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getUser = async (userId: string) => {
  const user = await prismadb.userAPILimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!user) {
    return {
      count: 0,
      characterCount: 0,
      subscriptionType: "FREE",
    };
  }

  return {
    count: user.count,
    characterCount: user.characterCount,
    subscriptionType: user.subscriptionType,
    currentSubscriptionPeriodEnd: user.currentSubscriptionPeriodEnd,
  };
};
