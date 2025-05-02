import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  description: string;
  footerText?: string;
  children: React.ReactNode;
}

export function StatsCard({
  title,
  description,
  footerText,
  children,
}: StatsCardProps) {
  return (
    <Card className='shadow-lg max-h-[350px] max-w-[500px]'>
      <CardHeader className='text-center'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footerText && (
        <CardFooter className='text-center'>
          <span className='text-green-500 font-semibold'>{footerText}</span>
          <TrendingUp className='inline-block ml-2 h-4 w-4' />
        </CardFooter>
      )}
    </Card>
  );
}
