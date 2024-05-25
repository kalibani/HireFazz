import { Loader2 } from 'lucide-react';
const Loader = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-y-4 bg-black bg-opacity-40">
      <div className="relative size-24 animate-spin">
        <Loader2 className="size-24 text-primary" />
      </div>
      <p className="text-sm text-white">BerryLabs is thinking...</p>
    </div>
  );
};

export default Loader;
