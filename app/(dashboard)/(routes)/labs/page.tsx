import React from "react";
import ComingSoon from "@/components/coming-soon";
import { redirect } from "next/navigation";

type Props = {};

const LabsPage = (props: Props) => {
  redirect("/coming-soon");
};

export default LabsPage;
