"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";

const NavTabs = () => {
  const pathname = usePathname();

  const tabs = [
    {
      title: "Token Info",
      href: "/",
    },
    {
      title: "Check Honeypot",
      href: "/honeypot",
      disabled: true,
    },
  ];

  const networks = ["eth", "bsc"];
  const splitPathname = pathname.split("/");

  if (splitPathname[1] && networks.includes(splitPathname[1]) && tabs[0]) {
    tabs[0].href = `/${pathname.split("/")[1]}/${pathname.split("/")[2]}`;
  }

  return (
    <nav className="mt-6 md:container">
      <h1 className="text-xl font-bold mb-2">Open DeFi</h1>
      <Tabs value={pathname} className="w-[400px]">
        <TabsList className="grid grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.href} value={tab.href} disabled={!!tab.disabled}>
              <Link href={tab.href}>{tab.title}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </nav>
  );
};

export default NavTabs;
