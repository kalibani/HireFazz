'use client';

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@radix-ui/react-hover-card';
import React from 'react';

const HoverComment = () => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer text-sm text-blue-500 hover:underline">
        Comment
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        className="z-10 max-w-xs rounded-md border border-primary bg-white p-3 shadow-md"
      >
        <p className="text-xs text-muted-foreground">
          The React Framework – created and maintained by @vercel.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverComment;
