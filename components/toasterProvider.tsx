"use client";

import { XCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export const ToasterProvider = () => {
  return <Toaster position="top-right" />;
};

export const errorToast = (message = 'Something went wrong') => {
  return toast(
    message,
    {
      icon: <XCircle  />,
      style: {
        color: 'red'
      },
      duration: 3500,
    }
  )
}