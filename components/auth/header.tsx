interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center mb-4">
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-primary font-extrabold text-3xl to-sky-400">
        BERRYLABS.io
      </div>
      <p className="text-muted-foreground ">{label}</p>
    </div>
  );
};

export default Header;
