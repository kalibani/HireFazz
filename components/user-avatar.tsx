import { useUser } from "@clerk/nextjs";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Props = {};

const UserAvatar = (props: Props) => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.profileImageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
