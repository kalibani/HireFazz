import Image from 'next/image';

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="Logo" src="/genio.png" fill sizes="100%" quality={20} />
      </div>
      <p className="text-sm text-muted-foreground">BerryLabs is thinking...</p>
    </div>
  );
};

export default Loader;
