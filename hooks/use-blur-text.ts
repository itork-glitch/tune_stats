"use client"

import { useState, useEffect, useRef } from "react"

interface UseBlurTextOptions {
  duration?: number
  delay?: number
  blur?: number
  threshold?: number
  once?: boolean
}

export function useBlurText({
  duration = 1000,
  delay = 0,
  blur = 10,
  threshold = 0.1,
  once = true,
}: UseBlurTextOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
          setIsAnimated(false)
        }
      },
      { threshold },
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [once, threshold])

  useEffect(() => {
    if (isVisible && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isAnimated, delay])

  const style = {
    filter: isAnimated ? "blur(0px)" : `blur(${blur}px)`,
    opacity: isAnimated ? 1 : 0,
    transition: `filter ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    willChange: "filter, opacity",
  }

  return { ref, style, isVisible, isAnimated }
}

