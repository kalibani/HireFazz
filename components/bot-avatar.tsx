import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar } from './ui/avatar';

const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/BerryLabs.png" />
    </Avatar>
  );
};

export default BotAvatar;
