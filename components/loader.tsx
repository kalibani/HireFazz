import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Loader2 color="#64786b" />
      </div>
      <p className="text-sm text-muted-foreground">SummaTalk is thinking...</p>
    </div>
  );
};

export default Loader;
