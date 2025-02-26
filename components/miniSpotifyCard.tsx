'use client';
import React, { useEffect, useState } from 'react';
import { PiCaretDoubleLeftFill, PiCaretDoubleRightFill } from 'react-icons/pi';
import { FaPause } from 'react-icons/fa';
import Image from 'next/image';

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const MiniSpotifyCard = ({
  albumArt,
  title,
  artist,
  duration,
}: {
  albumArt: string;
  title: string;
  artist: string;
  duration: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(Math.floor(Math.random() * (duration + 1)));
  }, [duration]);

  if (!isMounted) return null;

  const progressWidth = `${(currentTime / duration) * 100}%`;
  const remainingTime = duration - currentTime;

  return (
    <div className='relative max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-b from-gray-800/30 to-gray-900/30 text-white shadow-xl z-10'>
      <div className='absolute inset-0 flex justify-center items-center -z-10'>
        <div className='w-48 h-48 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,_red,_orange,_yellow,_green,_blue,_purple,_red)] blur-3xl opacity-70'></div>
      </div>
      <div className='flex justify-center pb-1'>
        <Image
          className='rounded-md object-cover'
          src={albumArt}
          alt={`${title} Album Cover`}
          width={144}
          height={144}
        />
      </div>
      <div>
        <h1 className='text-lg font-bold'>{title}</h1>
        <p className='text-sm text-gray-300'>{artist}</p>
      </div>
      <div className='pt-3'>
        <div className='relative h-1 bg-gray-600 rounded-full'>
          <div
            className='absolute top-0 left-0 h-1 bg-green-500 rounded-full transition-all'
            style={{ width: progressWidth }}
          />
        </div>
        <div className='flex justify-between text-xs text-gray-400 mt-1'>
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(remainingTime)}</span>
        </div>
      </div>
      <div className='text-3xl flex justify-center space-x-4 mt-4 cursor-pointer'>
        <PiCaretDoubleLeftFill />
        <FaPause />
        <PiCaretDoubleRightFill />
      </div>
    </div>
  );
};
