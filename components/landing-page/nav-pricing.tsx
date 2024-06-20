'use client';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { useRouter } from 'next/navigation';
import React from 'react';

const NavPricing = () => {
  const { push } = useRouter();
  const handleCLick = () => {
    push('/?section=pricing', { scroll: false });
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };
  return <span onClick={handleCLick}>Pricing</span>;
};

export default NavPricing;
