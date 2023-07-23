import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";

type Props = {};

const BotAvatar = (props: Props) => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/genio.png" />
    </Avatar>
  );
};

export default BotAvatar;
