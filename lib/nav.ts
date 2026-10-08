import { BookOpen, Cross, HandHeart, House, UserRound, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/prayers", label: "Prayers", icon: BookOpen },
  { href: "/rosary", label: "Rosary", icon: Cross },
  { href: "/intentions", label: "Intentions", icon: HandHeart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
