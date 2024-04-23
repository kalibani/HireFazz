import { UserButton } from '@/components/auth';

const Navbar =  () => {
  return (
    <div className="flex items-center py-2 px-3 bg-white border-b border-l justify-between">
        <p className='w-full font-normal text-sm'>{currentDate}</p>
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;

const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
