"use client";

import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavigationItemProps {
  href: string;
  title: string;
}

export const NavigationItem = ({ href, title }: NavigationItemProps) => {
  const pathname = usePathname();

  const isActiveLinkClass = href === pathname;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={cn(
          "hover:bg-transparent hover:text-neutral-100 text-neutral-400",
          {
            "text-neutral-100 cursor-default": isActiveLinkClass,
          }
        )}
        asChild
      >
        <Link href={href}>{title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
