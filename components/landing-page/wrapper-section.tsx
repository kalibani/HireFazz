import { cn } from '@/lib/utils';
import { HTMLProps, ReactNode } from 'react';

interface WrapperSectionProps extends HTMLProps<HTMLElement> {
  children: ReactNode;
  className?: string;
}
const WrapperSection = ({
  children,
  className,
  ...props
}: WrapperSectionProps) => {
  return (
    <section
      className={cn('mx-auto h-full w-full max-w-screen-xl', className)}
      {...props}
    >
      {children}
    </section>
  );
};

export default WrapperSection;
