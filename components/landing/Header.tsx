import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@civic/auth-web3/react";

function Header({
  isScrolled,
  onLogin,
}: {
  isScrolled: boolean;
  onLogin: () => Promise<void>;
}) {
  const router = useRouter();
  const civicUser = useUser();
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#050510]/90 backdrop-blur-md py-3 shadow-lg" : "py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">PaySZN</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#developers"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            Developers
          </Link>
          <Link
            href="#pricing"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#docs"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            Documentation
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:flex border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-white"
            onClick={onLogin}
          >
            Log In
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={() => {
              civicUser.user ? router.push("/dashboard") : onLogin();
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
