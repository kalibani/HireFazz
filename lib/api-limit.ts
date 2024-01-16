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

  if (userApiLimit) {
    await prismadb.userAPILimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userAPILimit.create({
      data: { userId: userId, count: 1 },
    });
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

export const getAPILimitCount = async (userId: string) => {
  const userApiLimit = await prismadb.userAPILimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};
