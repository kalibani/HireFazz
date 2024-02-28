import React, { ReactNode, Suspense } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import pick from 'lodash/pick';

type WrapperTranslate = {
  children: ReactNode;
  section: string;
};

const WrapperTranslate = ({ children, section }: WrapperTranslate) => {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, section)}>
      {children}
    </NextIntlClientProvider>
  );
};

export default WrapperTranslate;
