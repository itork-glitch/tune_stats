'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { errorsData } from '@/constants/navbar';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const ErrorHandler = () => {
  const searchParams = useSearchParams();
  const err_code = searchParams.get('error_code');

  const error = errorsData.find((err) => err.code === err_code);
  if (!error) return null;
  const Icon = error.icon;

  return (
    <Alert className='fixed bottom-4 right-4 z-50 w-[384px]'>
      <Icon className='h-5 w-5' />
      <AlertTitle>{error.title}</AlertTitle>
      <AlertDescription>{error.description}</AlertDescription>
    </Alert>
  );
};

export default ErrorHandler;
