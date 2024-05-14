'use client';

import { useState, useEffect } from 'react';
import ProModal from './pro-modal';
import TosModal from './tos-modal';
import ModalUploadCv from './job/create-job/modal-upload-cv';

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
    <>
      <ProModal />
      <TosModal />
      <ModalUploadCv />
    </>
  );
};

export default ModalProvider;
