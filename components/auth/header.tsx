interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center mb-4">
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] font-extrabold text-2xl via-[#A24688] to-[#4E3ABA]">
        {label}
      </div>
      <p className="text-muted-foreground text-sm ">to continue to BerryLabs</p>
    </div>
  );
};

export default Header;
