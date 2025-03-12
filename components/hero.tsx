'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MiniSpotifyCard } from './miniSpotifyCard';
import { songsCards } from '../constants/hero';
import { FaSpotify } from 'react-icons/fa';
import { BlurText } from './ui/blurText';
import { motion } from 'framer-motion';

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
        <BlurText
          text='Amplify Your Spotify Experience'
          className='text-5xl font-bold text-center flex items-center justify-center pb-1'
          animateBy='letters'
          direction='top'
          staggerDelay={30}
        />
        <BlurText
          text='Get personalized song suggestions and real-time streaming stats.'
          className='text-md md:text-xl text-gray-300 max-w-xl mx-auto flex items-center justify-center'
          animateBy='words'
          direction='bottom'
          staggerDelay={90}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 70 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeIn' }}
          className='my-2 flex justify-center'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-green-600 hover:bg-green-500 text-black py-2 px-6 rounded-lg font-semibold transition-colors flex gap-2 justify-center'>
            <FaSpotify className='text-2xl' /> Connect with Spotify
          </motion.button>
        </motion.div>
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
