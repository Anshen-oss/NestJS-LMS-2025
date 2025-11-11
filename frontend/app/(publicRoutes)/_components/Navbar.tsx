"use client";
import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/admin" },
];
export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16  items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image
            src={Logo}
            alt="Logo"
            className="size-9"
            width={32}
            height={32}
          />
          <span className="font-bold">Anshen LMS</span>
        </Link>

        {/** Desktop navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name}
                image={session.user.image || ""}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
                <Link href="/login" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
