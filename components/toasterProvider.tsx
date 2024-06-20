'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export const ToasterProvider = () => {
  return <Toaster position="top-right" />;
};

export const errorToast = (message = 'Something went wrong') => {
  return toast(message, {
    icon: <XCircle />,
    style: {
      color: 'red',
    },
    duration: 3500,
  });
};
export const successToast = (message = 'Success') => {
  return toast(message, {
    icon: <CheckCircle2 />,
    style: {
      color: 'green',
    },
    duration: 3500,
  });
};
