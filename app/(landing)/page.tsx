import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const LandingPage = (props: Props) => {
  return (
    <div>
      Landing Page
      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
