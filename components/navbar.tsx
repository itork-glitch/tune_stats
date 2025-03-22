'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaSpotify } from 'react-icons/fa';
import { Session } from '@supabase/supabase-js';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { components } from '@/constants/navbar';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ErrorHandler from './misc/navbar_err_handling';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    // Fetch the current session from Supabase
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session from Supabase:', error);
      }
      setSession(session);
    };

    getSession();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className='fixed top-0 left-0 right-0 bg-[hsl(0,0%,3.9%)] z-50 flex items-center justify-between px-4 py-2'>
      <div className='flex items-center'>
        <div className='flex items-center space-x-4'>
          <Link href='/'>
            <Image
              src='/tune_stats_logo.png'
              alt='Logo'
              width={40}
              height={40}
            />
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className='ml-4'>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[0.75fr_1fr]'>
                  <li className='row-span-3'>
                    <NavigationMenuLink asChild>
                      <a
                        className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                        href='/'>
                        <Image
                          src='/tune_stats_logo.png'
                          alt='TuneStats Logo'
                          height={64}
                          width={64}
                        />
                        <div className='text-lg font-medium'>Tune Stats</div>
                        <p className='text-sm leading-tight text-muted-foreground'>
                          Unlock Your Sound. Track. Discover. Repeat.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href='/docs' title='Introduction'>
                    Enhance your music journey with personalized
                    recommendations.
                  </ListItem>
                  <ListItem href='/docs/installation' title='AI Recomendation'>
                    Get personalized music suggestions based on your unique
                    taste and listening habits.
                  </ListItem>
                  <ListItem href='/docs/primitives/typography' title='Stats'>
                    Track your listening trends, top artists, and favorite
                    genres over time.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      pro={component.pro}
                      href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/docs' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        {!session ? (
          // Przycisk logowania tylko przekierowuje do endpointu logowania
          <Link href='/login'>
            <Button onClick={() => router.push('/login')}>
              Log with&nbsp;
              <FaSpotify className='text-2xl' />
            </Button>
          </Link>
        ) : (
          <div className='flex items-center space-x-2'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user.user_metadata.avatar_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='-translate-x-2'>
                <DropdownMenuLabel className='flex items-center gap-0.5'>
                  <span className='text-muted-foreground'>
                    {session.user.user_metadata.full_name}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href='/playground'>Playground</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <AlertDialog>
                    {/* 1. Trigger wywołujący AlertDialog */}
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>
                        {/* W tym miejscu może być też <button> lub sam tekst */}
                        <span className='text-red-600'>Sign out</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    {/* 2. Treść wyświetlana w okienku dialogowym */}
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will sign you out of your account. Are you
                          sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        {/* 3. Przyciski: Cancel i Action */}
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => supabase.auth.signOut()}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <Suspense>
        <ErrorHandler />
      </Suspense>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { pro?: boolean }
>(({ className, title, children, pro, ...props }, ref) => {
  const [hoverToggle, setHoverToggle] = useState(false);
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          onMouseEnter={() => setHoverToggle(true)}
          onMouseLeave={() => setHoverToggle(false)}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-[hsl(0,0%,14.9%)] focus:text-accent-foreground',
            className
          )}
          {...props}>
          <div className='flex items-center text-sm font-medium leading-none'>
            {title}
            {pro && (
              <span
                className={`ml-1 px-2 py-0.5 text-xs font-semibold border-2 rounded-lg ${
                  hoverToggle
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-indigo-800 border-indigo-600'
                } transition-colors duration-[350ms]`}>
                PRO
              </span>
            )}
          </div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
