import React from "react";

import ContactUs from "@/components/contact-us";
import Heading from "@/components/headings";
import { HeartHandshake } from "lucide-react";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Heading
        title="Help Center"
        description="Tell us what you need by sending email or whatsapp :)"
        icon={HeartHandshake}
        iconColor="text-red-700"
        bgColor="bg-red-500/10"
      />
      <ContactUs />
    </>
  );
};

export default page;
