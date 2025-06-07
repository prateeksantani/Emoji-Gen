"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGuestLogin = () => {
    // Set guest cookie
    document.cookie = "guest_user=true; path=/; max-age=2592000"; // 30 days
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-4 justify-end mt-4 mr-4">
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton />
          <Button variant="outline" onClick={handleGuestLogin}>
            Continue as Guest
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
}
