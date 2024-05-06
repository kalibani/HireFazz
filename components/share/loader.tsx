import Image from 'next/image';
import { Loader2 } from 'lucide-react';
const Loader = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-4">
      <div className="relative size-24 animate-spin">
        <Loader2 className="size-24 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">BerryLabs is thinking...</p>
    </div>
  );
};

export default Loader;
