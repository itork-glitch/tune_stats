'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MiniSpotifyCard } from './miniSpotifyCard';
import { songsCards } from '../constants/hero';
import { FaSpotify } from 'react-icons/fa';

function PhoneModel(props: any) {
  const gltf = useGLTF('/iphone.glb');
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const targetRotation = scrollPercent * Math.PI;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  return <primitive ref={meshRef} object={gltf.scene} {...props} />;
}

export default function Hero() {
  return (
    <section className='bg-black relative flex flex-col items-center justify-center min-h-screen px-4'>
      <div className='text-center mb-10'>
        <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
          Your AI-Driven Spotify Companion
        </h1>
        <p className='text-lg md:text-xl text-gray-300 max-w-xl mx-auto'>
          Get personalized song suggestions and real-time streaming stats.
        </p>
        <div className='mt-6 flex justify-center'>
          <button className='bg-green-600 hover:bg-green-500 text-black py-2 px-6 rounded-lg font-semibold transition-colors flex gap-1 justify-center'>
            <FaSpotify className='text-2xl' /> Connect with Spotify
          </button>
        </div>
      </div>

      <div className='relative w-full max-w-5xl h-[600px]'>
        <div className='absolute left-1/2 -translate-x-1/2 w-[400px] h-[1200px] bottom-0 translate-y-[60%] z-50'>
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            <PhoneModel scale={[1.3, 1.225, 1.3]} />
          </Canvas>
        </div>

        {songsCards.map((card, index) => (
          <div
            key={index}
            className='absolute'
            style={{
              top: `${card.position[0]}%`,
              [card.position[2] ? 'left' : 'right']: `${card.position[1]}%`,
            }}>
            <MiniSpotifyCard
              albumArt={card.albumArt}
              title={card.title}
              artist={card.artist}
              duration={card.duration}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
