"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
//import { Icons } from '@/components/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: {
  title: string;
  href: string;
  description: string;
  pro: boolean;
}[] = [
  {
    title: "Favorite Genres",
    href: "/docs/primitives/alert-dialog",
    description:
      "Discover your top genres and find more tracks that match your vibe.",
    pro: false,
  },
  {
    title: "Charts",
    href: "/docs/primitives/hover-card",
    description:
      "Explore your weekly vibe – see how your music shifts from day to day.",
    pro: false,
  },
  {
    title: "Listening Time",
    href: "/docs/primitives/progress",
    description:
      "Track your total listening time and see your most dedicated music moments.",
    pro: false,
  },
  {
    title: "Favorite Songs",
    href: "/docs/primitives/scroll-area",
    description:
      "Discover your all-time favorite songs, the ones you can't stop playing!",
    pro: false,
  },
  {
    title: "Monthly Wrapped",
    href: "/docs/primitives/tabs",
    description:
      "Relive your month in music—your top tracks and artists all in one place!",
    pro: false,
  },
  {
    title: "AI Recomendation",
    href: "/docs/primitives/tooltip",
    description:
      "Get personalized music suggestions based on your unique taste.",
    pro: true,
  },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background z-50 flex items-center px-4 py-2">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image src="/tune_stats_logo.png" alt="Logo" width={40} height={40} />
        </Link>
      </div>
      <NavigationMenu>
        {" "}
        <NavigationMenuList className="ml-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      {/* <Icons.logo className='h-6 w-6' /> */}
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Tune Stats
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Unlock Your Sound. Track. Discover. Repeat.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Introduction">
                  Enhance your music journey with personalized recommendations.
                </ListItem>
                <ListItem href="/docs/installation" title="AI Recomendation">
                  Get personalized music suggestions based on your unique taste
                  and listening habits.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Stats">
                  Track your listening trends, top artists, and favorite genres
                  over time.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) =>
                  component.pro ? (
                    <div
                      key={component.title}
                      className="flex flex-col gap-2 items-start hover:bg-blue-50 p-2 rounded-lg transition-all"
                    >
                      <ListItem href={component.href}>
                        <div className="flex items-center">
                          <span className="">{component.title}</span>
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 border border-blue-300 rounded-lg transition-all hover:bg-blue-400 ml-2">
                            PRO
                          </span>
                        </div>
                      </ListItem>
                      <div className="text-sm">{component.description}</div>
                    </div>
                  ) : (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
