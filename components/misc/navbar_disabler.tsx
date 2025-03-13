'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '../navbar';

const NavbarLayout = () => {
  const url = usePathname();
  const path = url.split('/').pop();
  const disabledPaths = ['playground', 'auth'];

  if (!path) return null;

  disabledPaths.includes(path) ? <Navbar /> : null;
};

export default NavbarLayout;
