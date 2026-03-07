"use client";

import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type MobileMenuProps = {
  links: { href: string; label: string }[];
  contactLabel: string;
};

export function MobileMenu({ links, contactLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-dark cursor-pointer md:hidden"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="border-border absolute inset-x-0 top-full z-50 border-t bg-white pb-4 shadow-md md:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 pt-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-body hover:text-primary hover:bg-primary-light rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Button
                  href="/contact"
                  size="sm"
                  variant="accent"
                  className="w-full rounded-full"
                >
                  {contactLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
