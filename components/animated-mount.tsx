"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

export type EasingFunction =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "cubic-bezier(0.25, 0.1, 0.25, 1)"
  | string

export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: EasingFunction
  fillMode?: "forwards" | "backwards" | "both" | "none"
}

export interface AnimatedMountProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
  inView?: boolean
  threshold?: number
  rootMargin?: string
  once?: boolean
  mountAnimation?: {
    from: React.CSSProperties
    to: React.CSSProperties
    config?: AnimationConfig
  }
  unmountAnimation?: {
    from: React.CSSProperties
    to: React.CSSProperties
    config?: AnimationConfig
  }
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  disabled?: boolean
}

export function AnimatedMount({
  children,
  className,
  style,
  as: Component = "div",
  inView: externalInView,
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
  mountAnimation = {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300, easing: "ease-out" },
  },
  unmountAnimation = {
    from: { opacity: 1 },
    to: { opacity: 0 },
    config: { duration: 300, easing: "ease-in" },
  },
  onAnimationComplete,
  onAnimationStart,
  disabled = false,
}: AnimatedMountProps) {
  const elementRef = useRef<HTMLElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Use external inView state if provided, otherwise use the hook
  const { inView: hookInView } = useInView({
    ref: elementRef,
    threshold,
    rootMargin,
    once,
    enabled: externalInView === undefined && !disabled,
  })

  const inView = externalInView !== undefined ? externalInView : hookInView

  // Convert CSS properties to WAAPI keyframes
  const cssToKeyframes = useCallback((from: React.CSSProperties, to: React.CSSProperties) => {
    return [{ ...from }, { ...to }]
  }, [])

  // Handle animation with Web Animations API
  const animate = useCallback(
    (element: HTMLElement, from: React.CSSProperties, to: React.CSSProperties, config: AnimationConfig = {}) => {
      if (animationRef.current) {
        animationRef.current.cancel()
      }

      const keyframes = cssToKeyframes(from, to)

      const animation = element.animate(keyframes, {
        duration: config.duration || 300,
        delay: config.delay || 0,
        easing: config.easing || "ease-out",
        fill: config.fillMode || "forwards",
      })

      setIsAnimating(true)
      if (onAnimationStart) onAnimationStart()

      animation.onfinish = () => {
        setIsAnimating(false)
        if (onAnimationComplete) onAnimationComplete()
      }

      animationRef.current = animation
      return animation
    },
    [cssToKeyframes, onAnimationComplete, onAnimationStart],
  )

  // Handle mount animation
  useEffect(() => {
    if (disabled) return

    const element = elementRef.current
    if (!element) return

    if (inView && !isMounted) {
      const { from, to, config } = mountAnimation
      animate(element, from, to, config)
      setIsMounted(true)
    } else if (!inView && isMounted && !once) {
      const { from, to, config } = unmountAnimation
      animate(element, from, to, config)
      setIsMounted(false)
    }
  }, [inView, isMounted, animate, mountAnimation, unmountAnimation, once, disabled])

  // Apply initial styles
  const initialStyle = !isMounted && !isAnimating ? mountAnimation.from : {}

  return (
    <Component
      ref={elementRef}
      className={cn(className)}
      style={{
        ...initialStyle,
        ...style,
      }}
    >
      {children}
    </Component>
  )
}

