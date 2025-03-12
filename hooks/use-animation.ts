"use client"

import { useRef, useState, useCallback, useEffect } from "react"

interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  fillMode?: "forwards" | "backwards" | "both" | "none"
}

interface UseAnimationOptions {
  onStart?: () => void
  onComplete?: () => void
  autoPlay?: boolean
}

export function useAnimation(options: UseAnimationOptions = {}) {
  const { onStart, onComplete, autoPlay = false } = options
  const elementRef = useRef<HTMLElement | null>(null)
  const animationRef = useRef<Animation | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const animate = useCallback(
    (from: Record<string, any>, to: Record<string, any>, config: AnimationConfig = {}) => {
      const element = elementRef.current
      if (!element) return

      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel()
      }

      // Create keyframes
      const keyframes = [{ ...from }, { ...to }]

      // Start animation
      const animation = element.animate(keyframes, {
        duration: config.duration || 300,
        delay: config.delay || 0,
        easing: config.easing || "ease",
        fill: config.fillMode || "forwards",
      })

      setIsAnimating(true)
      if (onStart) onStart()

      animation.onfinish = () => {
        setIsAnimating(false)
        if (onComplete) onComplete()
      }

      animationRef.current = animation
      return animation
    },
    [onStart, onComplete],
  )

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel()
      setIsAnimating(false)
    }
  }, [])

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play()
    }
  }, [])

  // Auto-play animation if specified
  useEffect(() => {
    if (autoPlay && elementRef.current) {
      // Implementation depends on what "autoPlay" means in your context
      // This is just a placeholder
    }
  }, [autoPlay])

  return {
    ref: elementRef,
    animate,
    stop,
    pause,
    resume,
    isAnimating,
  }
}

