"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Branding } from "./branding";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Support", href: "/support" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // useBodyScrollLock - prevents body from scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div>
      <header className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Branding />
          <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex md:items-center md:gap-x-6">
            {/* Navigation Menu */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-all hover:text-muted-foreground"
              >
                {item.name}
              </Link>
            ))}

            {/* Separator */}
            <div className="hidden md:block h-5 w-px bg-foreground/30"></div>

            {/* Buttons */}
            <Link href="/login">
              <Button variant="outline" className="h-10">Log in</Button>
            </Link>
            <Button className="h-10">Check Your Score</Button>
          </div>
        </nav>

        {/* mobile menu */}
        {isOpen && (
          <div className="bg-white dark:bg-black absolute top-0 left-0 w-full h-full px-4 py-6 z-50 overflow-auto md:hidden lg:px-8">
            <div className="flex items-center justify-between">
              <Branding />
              <button onClick={() => setIsOpen(!isOpen)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="my-6">
              <div className="-my-6 divide-y">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block px-3 py-2 text-base font-semibold"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/login"
                    className="-mx-3 block px-3 py-2.5 text-base font-semibold"
                  >
                    Log in
                  </Link>
                  <Link
                    href="#"
                    className="-mx-3 block px-3 py-2.5 text-base font-semibold"
                  >
                    Check Your Score
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
