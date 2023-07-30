"use client";

import { useState, useEffect } from "react";
import ProModal from "./pro-modal";

type Props = {};

const ModalProvider = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <ProModal />
    </div>
  );
};

export default ModalProvider;
