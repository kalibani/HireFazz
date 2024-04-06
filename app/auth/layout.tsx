import Image from 'next/image';
import logo from '@/public/icons/logo.svg';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center ">
      <div className="lg:h-[795px] flex items-center rounded-3xl shadow-xl lg:overflow-hidden">
        <div className=" bg-rose-600 h-full lg:flex items-center p-36 w-1/2 justify-center hidden">
          <Image alt="logo" src={logo} priority quality={30} />
        </div>
        <div className="xl:px-32 lg:w-1/2 w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
