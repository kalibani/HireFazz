import { UserButton } from '@/components/auth';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-l bg-white px-3 py-2">
      <p className="w-full text-sm font-normal">{currentDate}</p>
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
